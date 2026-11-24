# 🛰️ GPS Locator – React Native / Expo

Prosta aplikacja na Androida pokazująca aktualne współrzędne GPS.

---

## 📁 Struktura plików

```
gps-app/
├── App.js          ← Główny kod aplikacji (cała logika + UI)
├── app.json        ← Konfiguracja Expo (nazwa, uprawnienia, ikony)
├── babel.config.js ← Konfiguracja kompilatora (nie ruszaj)
├── eas.json        ← Konfiguracja budowania APK
├── package.json    ← Lista zależności (biblioteki)
└── README.md       ← Ten plik
```

---

## 🚀 Jak uruchomić i zbudować APK

### KROK 1 – Zainstaluj Node.js

Pobierz i zainstaluj Node.js ze strony: https://nodejs.org  
Wybierz wersję **LTS** (np. 20.x).

Sprawdź czy działa:
```bash
node --version
npm --version
```

---

### KROK 2 – Zainstaluj zależności projektu

Otwórz terminal w folderze `gps-app/` i wpisz:

```bash
npm install
```

Pobrze biblioteki React Native, Expo i expo-location (~300MB, chwilę poczekaj).

---

### KROK 3 – Przetestuj na telefonie (bez budowania APK)

To najszybszy sposób na podgląd aplikacji na żywo.

**a)** Zainstaluj aplikację **Expo Go** na telefonie:
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

**b)** Uruchom serwer deweloperski:
```bash
npx expo start
```

**c)** W terminalu pojawi się QR kod.  
Otwórz Expo Go na telefonie → zeskanuj QR kod.  
Aplikacja otworzy się na telefonie! Zmiany w kodzie odświeżają się automatycznie.

---

### KROK 4 – Zbuduj APK (do lokalnej instalacji)

Są dwa sposoby:

#### ✅ SPOSÓB A: EAS Build (zalecany, darmowy, bez konfiguracji)

EAS Build buduje APK w chmurze Expo – nie potrzebujesz Android Studio.

**a)** Zainstaluj EAS CLI:
```bash
npm install -g eas-cli
```

**b)** Zaloguj się / utwórz konto Expo (darmowe):
```bash
eas login
```
Jeśli nie masz konta – wejdź na https://expo.dev i zarejestruj się.

**c)** Skonfiguruj projekt (tylko raz):
```bash
eas build:configure
```
Naciśnij Enter na wszystkie pytania (domyślne ustawienia są OK).

**d)** Zbuduj APK:
```bash
eas build -p android --profile preview
```

Budowanie trwa ~5-10 minut w chmurze.  
Po zakończeniu dostaniesz **link do pobrania pliku .apk**.

**e)** Pobierz APK i prześlij na telefon (przez kabel USB lub Google Drive).  
Na telefonie włącz: **Ustawienia → Bezpieczeństwo → Instalacja z nieznanych źródeł**.  
Otwórz plik .apk i zainstaluj.

---

#### 🔧 SPOSÓB B: Lokalnie (wymaga Android Studio)

Tylko jeśli chcesz budować bez internetu lub masz specyficzne potrzeby.

**a)** Zainstaluj Android Studio: https://developer.android.com/studio  
**b)** Zainstaluj Android SDK (przez Android Studio → SDK Manager)  
**c)** Ustaw zmienną środowiskową ANDROID_HOME  
**d)** Uruchom:
```bash
npx expo run:android
```

---

## 📱 Co robi aplikacja?

1. Po kliknięciu przycisku **"Pobierz lokalizację"** – aplikacja prosi o zgodę na GPS
2. Po przyznaniu zgody pobiera aktualne współrzędne
3. Wyświetla w polu tekstowym:
   - Szerokość geograficzna (latitude)
   - Długość geograficzna (longitude)  
   - Wysokość n.p.m. (jeśli dostępna)
   - Dokładność pomiaru w metrach
   - Datę i godzinę pomiaru

---

## 🛠️ Jak modyfikować aplikację?

Cały kod jest w pliku **App.js** – każda linijka jest opisana komentarzem.

Kluczowe miejsca:
- **`getLocation()`** – funkcja pobierająca GPS (linia ~50)
- **`const result = ...`** – formatowanie wyniku (linia ~85)  
- **`const styles = ...`** – wszystkie style/kolory (linia ~180)

---

## ❓ Częste problemy

**"Permission denied"** – zezwól aplikacji na dostęp do lokalizacji w ustawieniach telefonu.

**"Location unavailable"** – wyjdź na zewnątrz lub włącz Wi-Fi (pomaga w lokalizacji).

**Expo Go nie skanuje QR** – upewnij się że telefon i komputer są w tej samej sieci Wi-Fi.

**`npm install` błędy** – spróbuj: `npm install --legacy-peer-deps`

---

## 📚 Przydatne linki

- Dokumentacja Expo: https://docs.expo.dev
- Dokumentacja expo-location: https://docs.expo.dev/versions/latest/sdk/location/
- EAS Build: https://docs.expo.dev/build/introduction/
- React Native docs: https://reactnative.dev/docs/getting-started
