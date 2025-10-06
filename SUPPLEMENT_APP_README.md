# Supplement App - Социална мрежа за хранителни добавки

Социална мрежа за хора, които се интересуват от хранителни добавки, диети и здраве.

## 🎯 Основни функции

### 1. OCR Сканиране
- Снимай етикети на добавки с камерата
- Автоматично разпознаване на текст (български и английски)
- AI анализ с Claude за извличане на:
  - Име на продукта
  - Марка
  - Съставки
  - Размер на порцията
  - Брой порции
  - Предупреждения
  - Алергени

### 2. Социална мрежа
- **Feed** - Новини от общността
- **Explore** - Търсене по добавки и режими
- **Profile** - Личен профил със статистики

### 3. Freemium модел
#### Free план
- 5 OCR сканирания месечно
- Четене на публикации
- Базови функции

#### Pro план
- Неограничени OCR сканирания
- Запазени режими
- Експорт на данни
- Приоритетен AI анализ

## 🏗 Архитектура

### Frontend
- **React Native** + **Expo SDK 53**
- **iOS оптимизирано** приложение
- **Nativewind** (Tailwind CSS) за стилизиране
- **Zustand** за state management с AsyncStorage persistence
- **expo-camera** за OCR сканиране
- **React Navigation** за навигация (bottom tabs + native stack)

### Backend (Ваш сървър)
- **FastAPI** на `145.223.96.213:8000`
- **EasyOCR** за разпознаване на текст
- **Anthropic Claude** за AI анализ
- Endpoints:
  - `POST /scan` - OCR сканиране
  - `POST /analyze` - AI анализ

## 📱 Структура на приложението

```
src/
├── api/
│   └── supplement-backend.ts    # API клиент за backend
├── navigation/
│   └── AppNavigator.tsx         # Tab + Stack навигация
├── screens/
│   ├── FeedScreen.tsx           # Новини
│   ├── ScanScreen.tsx           # Камера за OCR
│   ├── ScanResultScreen.tsx     # Резултат от сканиране
│   └── ProfileScreen.tsx        # Профил и статистики
└── state/
    └── appStore.ts              # Zustand store
```

## 🎨 Екрани

### 1. Feed екран
- Показва последни публикации от общността
- Твоите последни сканирания
- Лайкове и коментари

### 2. Scan екран
- Камера с overlay guide
- Брояч на останали сканирания
- Избор на снимка от галерията
- Flip камера (front/back)
- Автоматично изпраща до backend за OCR + AI анализ

### 3. ScanResult екран
- Снимка на етикета
- Име и марка на продукта
- Съставки (chips)
- Информация за дозиране
- Предупреждения и алергени
- Бутони за споделяне

### 4. Profile екран
- Статистики (общо сканирания, запазени, този месец)
- Информация за абонамент
- Upgrade to Pro бутон
- Списък с функции

## 🔒 Freemium логика

State management в `appStore.ts`:
- Проверка на `scansThisMonth` < 5 за free потребители
- Автоматичен reset на брояча след 30 дни
- `isPro` flag за premium функции
- Modal при достигане на лимита

## 🚀 Как да стартирате

Приложението вече е конфигурирано и готово за работа!

```bash
# Старт на dev server (автоматично на port 8081)
bun start

# Сканирайте QR кода с Expo Go или Vibecode App
```

## 🔑 API Integration

Backend API е на `http://145.223.96.213:8000`

### Scan endpoint
```typescript
POST /scan
Content-Type: multipart/form-data

// Response
{
  success: true,
  text: "OCR разпознат текст...",
  lines: ["line1", "line2", ...]
}
```

### Analyze endpoint
```typescript
POST /analyze
Content-Type: application/json
{
  "text": "OCR текст..."
}

// Response
{
  success: true,
  data: {
    product_name: "BCAA 2:1:1",
    brand: "Optimum Nutrition",
    ingredients: ["L-Leucine", "L-Isoleucine", ...],
    serving_size: "5g",
    servings_per_container: 60,
    warnings: [],
    allergens: [],
    description: "..."
  }
}
```

## 📦 Използвани пакети

Всички необходими пакети са предварително инсталирани:
- `expo-camera` - камера и OCR
- `@react-navigation/bottom-tabs` - долна навигация
- `@react-navigation/native-stack` - stack навигация
- `zustand` - state management
- `@react-native-async-storage/async-storage` - локално съхранение
- `expo-image-picker` - избор на снимки
- `nativewind` - Tailwind styling

## 🎯 Следващи стъпки

За да направите приложението напълно функционално:

1. ✅ Backend е готов и работи
2. ✅ OCR + AI интеграция е внедрена
3. 🔄 Добавете социални функции (публикации, коментари, лайкове)
4. 🔄 Внедрете payment за Pro план
5. 🔄 Добавете уведомления за напомняния
6. 🔄 Въведете Apple Intelligence (on-device AI)

## 🌟 Уникални предимства

- ✅ **Български език** - OCR работи на кирилица
- ✅ **Собствен backend** - пълен контроол
- ✅ **Privacy focused** - планирате Apple Intelligence
- ✅ **Социална компонента** - не само tracker
- ✅ **OCR технология** - бързо сканиране вместо ръчно въвеждане

---

Създадено с ❤️ за българската fitness общност
