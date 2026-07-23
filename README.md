# ChoreMate / Together — Frontend

React (Vite) клієнт для платформи спільного управління побутовими обов'язками.

## Стек
- React 18 + Vite
- React Router
- Axios
- Context API для авторизації (без Redux — MVP-масштаб)

## Швидкий старт

1. Встановити залежності:
   ```bash
   npm install
   ```

2. Скопіювати `.env.example` у `.env` і вказати адресу бекенду:
   ```bash
   cp .env.example .env
   ```

3. Запустити dev-сервер:
   ```bash
   npm run dev
   ```

Застосунок підніметься на `http://localhost:5173`. Переконайтесь, що бекенд запущено на `http://localhost:4000` (див. репозиторій `choremate-backend`).

## Структура проєкту

```
src/
  api/            # axios-клієнт та функції для звернення до API
  components/     # TaskCard, TaskForm, AttentionRelayModal, StatsBar, InviteCodeBox
  context/         # AuthContext (поточний користувач, токен)
  pages/           # Login, Register, Onboarding, Dashboard, Statistics
  App.jsx          # маршрутизація
  main.jsx         # точка входу
```

## Реалізовані екрани (MVP, згідно з FE user stories)

- **Login / Register** — форми входу та реєстрації.
- **Onboarding** — створення спільного простору (з invite-кодом і кнопкою копіювання) або приєднання за кодом.
- **Dashboard** — список задач з чекбоксами виконання, бейджами регулярності та відповідального, віджети балів і стріку, кнопка додавання задачі.
- **Attention Relay modal** — з'являється при кліку на прострочену задачу: готові шаблони жестів + поле для власної ідеї.
- **Statistics** — прогрес-бари розподілу навантаження між учасниками, кількість виконаних/прострочених задач, найактивніший учасник.

## Що варто додати далі
- Google/Apple OAuth кнопки
- Push-сповіщення (nice to have з ТЗ)
- Спільні цілі та винагороди (nice to have)
- Сімейний календар, чат, спільні нотатки (nice to have)
- Unit/e2e тести (Vitest + React Testing Library, Playwright)
