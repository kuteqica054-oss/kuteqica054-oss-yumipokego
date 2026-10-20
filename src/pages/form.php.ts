import type { APIRoute } from 'astro';
import site from '../config/site.json';
import { routes } from '../i18n/routes';

/*
  /form.php — franchise başvuru formlarının PHP işleyicisi (Hostinger).
  Başvuruyu site.json → contacts.general.email adresine e-postayla gönderir ve:
   - fetch() isteklerine (Accept: application/json) JSON {ok:true} döner,
   - JS'siz gönderimlerde başvuru sayfasına ?sent=1 ile yönlendirir.
  Derleme sırasında üretilir; içinde gizli bilgi yoktur.
*/
export const GET: APIRoute = () => {
  const to = site.contacts.general.email ?? '';
  const host = site.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const php = `<?php
// Derleme sırasında src/pages/form.php.ts dosyasından üretilir — bu dosyayı değil, onu düzenleyin.
declare(strict_types=1);

$TO = ${JSON.stringify(to)};
$BRAND = ${JSON.stringify(site.brand)};
$FROM = 'noreply@' . preg_replace('/^www\\./', '', $_SERVER['HTTP_HOST'] ?? ${JSON.stringify(host)});
$REDIRECT = ['tr' => ${JSON.stringify(routes.apply.tr)}, 'en' => ${JSON.stringify(routes.apply.en)}];
$REDIRECT_QUICK = ['tr' => '/', 'en' => '/en/'];

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
$lang = (($_POST['site_language'] ?? 'tr') === 'en') ? 'en' : 'tr';
$quick = ($_POST['form_type'] ?? '') === 'quick';

function done(bool $ok, string $msg, int $code = 200): void {
  global $wantsJson, $lang, $quick, $REDIRECT, $REDIRECT_QUICK;
  if ($wantsJson) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['ok' => $ok, 'error' => $ok ? null : $msg]);
  } elseif ($ok) {
    $to = $quick ? $REDIRECT_QUICK[$lang] . '?sent=1#on-basvuru' : $REDIRECT[$lang] . '?sent=1';
    header('Location: ' . $to, true, 303);
  } else {
    http_response_code($code);
    header('Content-Type: text/plain; charset=utf-8');
    echo $msg;
  }
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') done(false, 'Method not allowed', 405);
if ($TO === '') done(false, 'Form recipient is not configured', 503);
// Honeypot: botlar gizli alanı doldurur. Başarılı gibi davran.
if (!empty($_POST['bot-field'])) done(true, '');

$clean = fn($v) => trim(str_replace(["\\r", "\\n"], ' ', (string)$v));
$first = $clean($_POST['first_name'] ?? '');
$last = $clean($_POST['last_name'] ?? '');
$name = trim($first . ' ' . $last);
$email = $clean($_POST['email'] ?? '');
$phone = $clean($_POST['phone'] ?? '');
if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['kvkk_consent'])) {
  done(false, 'Missing required fields', 422);
}

$fields = [
  'Form' => $quick ? 'Ön başvuru (ana sayfa)' : 'Franchise başvurusu',
  'Dil / Language' => $lang,
  'Ad Soyad' => $name, 'Telefon' => $phone, 'E-posta' => $email,
  'Şehir' => $_POST['city'] ?? '', 'Ülke' => $_POST['country'] ?? '',
  'Format' => $_POST['format'] ?? '', 'Bölge' => $_POST['region'] ?? '',
  'Mülk' => $_POST['premises'] ?? '', 'Alan (m²)' => $_POST['area'] ?? '',
  'Bütçe' => $_POST['budget'] ?? '', 'Finansman' => $_POST['funding'] ?? '',
  'Açılış zamanı' => $_POST['timeline'] ?? '', 'Deneyim' => $_POST['experience'] ?? '',
  'Mevcut iş' => $_POST['occupation'] ?? '', 'Restoran sayısı' => $_POST['units'] ?? '',
  'KVKK onayı' => !empty($_POST['kvkk_consent']) ? 'Evet' : 'Hayır',
  'Ticari ileti onayı (İYS)' => !empty($_POST['marketing_consent']) ? 'Evet' : 'Hayır',
  'Sayfa' => $_POST['page'] ?? '',
  'Tarih' => date('Y-m-d H:i:s'),
  'IP' => $_SERVER['REMOTE_ADDR'] ?? '',
];
$text = "Yeni franchise başvurusu\\n\\n";
foreach ($fields as $k => $v) { $text .= str_pad($k . ':', 26) . $clean(is_string($v) ? $v : '') . "\\n"; }
$text .= "\\nMesaj:\\n" . trim((string)($_POST['message'] ?? '')) . "\\n";

$headers = [
  'From: ' . $BRAND . ' <' . $FROM . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
];
$subject = '=?UTF-8?B?' . base64_encode(($quick ? 'Ön başvuru: ' : 'Franchise başvurusu: ') . $name) . '?=';
$ok = mail($TO, $subject, $text, implode("\\r\\n", $headers), '-f' . $FROM);
done($ok, $ok ? '' : 'Mail could not be sent', $ok ? 200 : 500);
`;
  return new Response(php, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
