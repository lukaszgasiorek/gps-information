// ============================================================
// App.js – Główny plik aplikacji
// Cała logika i interfejs aplikacji są tutaj
// ============================================================

// Importujemy React oraz hook useState do zarządzania stanem
import React, { useState } from 'react';

// Importujemy komponenty z React Native:
// - View: kontener (jak <div> w HTML)
// - Text: wyświetlanie tekstu (jak <p> w HTML)
// - TextInput: pole tekstowe (jak <textarea> w HTML)
// - TouchableOpacity: przycisk z efektem kliknięcia
// - StyleSheet: do definiowania stylów CSS
// - ActivityIndicator: kręcące się kółko ładowania
// - SafeAreaView: respektuje "notch" telefonu
// - ScrollView: przewijany kontener
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';

// Importujemy bibliotekę Expo do obsługi GPS
import * as Location from 'expo-location';

// Importujemy pasek statusu (górny pasek telefonu)
import { StatusBar } from 'expo-status-bar';

// ============================================================
// Główny komponent aplikacji
// ============================================================
export default function App() {

  // Stan: tekst wyświetlany w polu textarea
  // useState('') oznacza: zacznij od pustego stringa
  const [coordinates, setCoordinates] = useState('');

  // Stan: czy aplikacja aktualnie pobiera lokalizację (true/false)
  const [isLoading, setIsLoading] = useState(false);

  // Stan: komunikat błędu (pusty jeśli brak błędu)
  const [error, setError] = useState('');

  // ============================================================
  // Funkcja wywoływana po kliknięciu przycisku
  // async/await = funkcja asynchroniczna (czeka na wynik GPS)
  // ============================================================
  const getLocation = async () => {

    // Czyścimy poprzedni błąd przed nową próbą
    setError('');

    // Pokazujemy animację ładowania
    setIsLoading(true);

    try {
      // KROK 1: Prosimy użytkownika o zgodę na dostęp do GPS
      // requestForegroundPermissionsAsync() – pokazuje systemowe okno zgody
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Sprawdzamy czy użytkownik przyznał zgodę
      if (status !== 'granted') {
        // Jeśli odmówił – ustawiamy błąd i kończymy
        setError('❌ Brak zgody na dostęp do lokalizacji.\nZezwól aplikacji w ustawieniach telefonu.');
        setIsLoading(false);
        return; // Wychodzimy z funkcji
      }

      // KROK 2: Pobieramy aktualne współrzędne GPS
      // accuracy: HIGH = najdokładniejszy pomiar
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Wyciągamy wartości z obiektu lokalizacji
      const { latitude, longitude, altitude, accuracy } = location.coords;

      // KROK 3: Formatujemy wynik do czytelnego tekstu
      // toFixed(6) = 6 miejsc po przecinku (dokładność ~10cm)
      const result =
        `📍 WSPÓŁRZĘDNE GPS\n` +
        `${'─'.repeat(30)}\n` +
        `🌐 Szerokość (lat):   ${latitude.toFixed(6)}°\n` +
        `🌐 Długość  (lon):   ${longitude.toFixed(6)}°\n` +
        `⛰️  Wysokość:         ${altitude ? altitude.toFixed(1) + ' m' : 'niedostępna'}\n` +
        `🎯 Dokładność:       ±${accuracy.toFixed(0)} m\n` +
        `${'─'.repeat(30)}\n` +
        `🕐 ${new Date().toLocaleString('pl-PL')}`;

      // Wpisujemy sformatowany tekst do textarea
      setCoordinates(result);

    } catch (err) {
      // Jeśli cokolwiek pójdzie nie tak – pokazujemy błąd
      setError('❌ Błąd pobierania lokalizacji:\n' + err.message);
    } finally {
      // finally = wykona się ZAWSZE, niezależnie od sukcesu/błędu
      // Chowamy animację ładowania
      setIsLoading(false);
    }
  };

  // ============================================================
  // Funkcja czyszcząca textarea i błędy
  // ============================================================
  const clearOutput = () => {
    setCoordinates('');
    setError('');
  };

  // ============================================================
  // JSX – to co wyświetla się na ekranie
  // (składnia podobna do HTML, ale to React Native)
  // ============================================================
  return (
    // SafeAreaView – zapewnia że treść nie wchodzi pod "notch"
    <SafeAreaView style={styles.safeArea}>

      {/* StatusBar – styl górnego paska telefonu */}
      <StatusBar style="light" />

      {/* ScrollView – umożliwia przewijanie jeśli treść nie mieści się na ekranie */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Główny kontener */}
        <View style={styles.container}>

          {/* ---- NAGŁÓWEK ---- */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🛰️</Text>
            <Text style={styles.headerTitle}>GPS Locator</Text>
            <Text style={styles.headerSubtitle}>Pobierz swoje aktualne współrzędne</Text>
          </View>

          {/* ---- TEXTAREA / POLE WYNIKOWE ---- */}
          <View style={styles.outputContainer}>
            <Text style={styles.label}>Wynik:</Text>

            {/* TextInput – pole tekstowe (odpowiednik textarea w HTML) */}
            {/* multiline={true} = obsługuje wiele linii tekstu */}
            {/* editable={false} = tylko do odczytu, użytkownik nie może edytować */}
            <TextInput
              style={[
                styles.textarea,
                // Jeśli jest błąd – dodajemy czerwone obramowanie
                error ? styles.textareaError : null,
              ]}
              multiline={true}           // Wiele linii
              editable={false}           // Tylko do odczytu
              value={error || coordinates}  // Pokazujemy błąd LUB współrzędne
              placeholder="Tutaj pojawią się Twoje współrzędne GPS..."
              placeholderTextColor="#999"
              textAlignVertical="top"    // Tekst od góry (jak w textarea HTML)
            />
          </View>

          {/* ---- PRZYCISKI ---- */}
          <View style={styles.buttonContainer}>

            {/* Przycisk pobierania GPS */}
            {/* disabled={isLoading} = nieaktywny podczas ładowania */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={getLocation}   // onPress = onClick w HTML
              disabled={isLoading}
              activeOpacity={0.8}     // Lekka przezroczystość po kliknięciu
            >
              {/* Jeśli ładuje – pokaż kółko, jeśli nie – pokaż tekst */}
              {isLoading ? (
                <View style={styles.buttonInner}>
                  {/* ActivityIndicator = animowane kółko ładowania */}
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>  Pobieranie GPS...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>📍 Pobierz lokalizację</Text>
              )}
            </TouchableOpacity>

            {/* Przycisk czyszczenia – pojawia się tylko gdy jest coś do wyczyszczenia */}
            {(coordinates || error) && (
              <TouchableOpacity
                style={styles.buttonClear}
                onPress={clearOutput}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonClearText}>🗑️ Wyczyść</Text>
              </TouchableOpacity>
            )}

          </View>

          {/* ---- STOPKA / INFO ---- */}
          <Text style={styles.footer}>
            Wymaga GPS i zgody na lokalizację
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLE – odpowiednik CSS
// StyleSheet.create() optymalizuje style na urządzeniu
// ============================================================
const styles = StyleSheet.create({

  // Zewnętrzny kontener – pełny ekran
  safeArea: {
    flex: 1,                    // Zajmij całą dostępną przestrzeń
    backgroundColor: '#1a1a2e', // Ciemne tło (granatowe)
  },

  // Kontener ScrollView – wyrównanie pionowe
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Główny kontener z paddingiem
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // Sekcja nagłówka
  header: {
    alignItems: 'center',       // Wyśrodkuj poziomo
    marginBottom: 32,
  },

  // Duże emoji w nagłówku
  headerIcon: {
    fontSize: 56,
    marginBottom: 8,
  },

  // Tytuł aplikacji
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0ff',           // Jasny niebieski/biały
    letterSpacing: 1,
  },

  // Podtytuł
  headerSubtitle: {
    fontSize: 14,
    color: '#8888aa',           // Szary
    marginTop: 4,
  },

  // Kontener pola wynikowego
  outputContainer: {
    marginBottom: 20,
  },

  // Etykieta "Wynik:"
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8888aa',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase', // Wielkie litery
  },

  // Pole textarea
  textarea: {
    backgroundColor: '#16213e',  // Ciemne tło pola
    borderWidth: 1,
    borderColor: '#2d2d5e',      // Obramowanie
    borderRadius: 12,            // Zaokrąglone rogi
    padding: 16,
    minHeight: 200,              // Minimalna wysokość
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Font monospaced
    color: '#7fffd4',            // Zielonkawy tekst (jak terminal)
    lineHeight: 22,
  },

  // Textarea z błędem – czerwone obramowanie
  textareaError: {
    borderColor: '#ff6b6b',
    color: '#ff6b6b',
  },

  // Kontener przycisków
  buttonContainer: {
    gap: 12,                    // Odstęp między przyciskami
  },

  // Główny przycisk GPS
  button: {
    backgroundColor: '#0f3460',  // Ciemny niebieski
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a90d9',      // Niebieskie obramowanie
    shadowColor: '#4a90d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,                // Cień na Androidzie
  },

  // Przycisk podczas ładowania – lekko przyciemniony
  buttonDisabled: {
    opacity: 0.7,
  },

  // Wnętrze przycisku (ikona + tekst obok siebie)
  buttonInner: {
    flexDirection: 'row',        // Elementy obok siebie
    alignItems: 'center',
  },

  // Tekst w przycisku
  buttonText: {
    color: '#e0e0ff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Przycisk czyszczenia
  buttonClear: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444466',
  },

  // Tekst przycisku czyszczenia
  buttonClearText: {
    color: '#8888aa',
    fontSize: 14,
  },

  // Stopka
  footer: {
    textAlign: 'center',
    color: '#555577',
    fontSize: 12,
    marginTop: 24,
  },
});
