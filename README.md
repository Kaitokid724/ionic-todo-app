# 📱 Ionic Todo App

Aplicación de lista de tareas (To-Do) construida por Daniel Valencia p, con Ionic 7 + Angular 17, con soporte de categorías, filtros, Firebase Remote Config y compilación para Android/iOS con Cordova.

---

## 🗂️ Estructura del Proyecto

```
ionic-todo-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-item/         # Componente de tarjeta de tarea
│   │   │   ├── filter-bar/        # Barra de filtros por categoría y estado
│   │   │   ├── empty-state/       # Estado vacío reutilizable
│   │   │   └── stats-card/        # Dashboard de estadísticas (feature flag)
│   │   ├── models/
│   │   │   ├── task.model.ts      # Interfaces y tipos de tarea
│   │   │   └── category.model.ts  # Interfaces y tipos de categoría
│   │   ├── pages/
│   │   │   ├── home/              # Página principal con lista de tareas
│   │   │   ├── categories/        # Gestión de categorías
│   │   │   └── task-detail/       # Detalle y edición de tarea
│   │   ├── services/
│   │   │   ├── task.service.ts        # CRUD de tareas + filtros (signals)
│   │   │   ├── category.service.ts    # CRUD de categorías (signals)
│   │   │   ├── storage.service.ts     # Abstracción de localStorage
│   │   │   └── firebase.service.ts    # Firebase + Remote Config
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts         # Dev (configurar Firebase aquí)
│   │   └── environment.prod.ts    # Producción
│   ├── theme/
│   │   └── variables.scss         # Variables de color Ionic + custom
│   ├── global.scss
│   └── index.html
├── config.xml                     # Configuración Cordova
├── ionic.config.json
├── angular.json
├── package.json
└── README.md
```

---

## ✅ Funcionalidades

### Tareas
- ➕ Crear tareas con título, descripción, categoría, prioridad y fecha límite
- ✅ Marcar tareas como completadas/pendientes
- ✏️ Editar tareas desde la vista de detalle
- 🗑️ Eliminar tareas (con confirmación)

### Categorías
- 🗂️ Crear, editar y eliminar categorías
- 🎨 Asignar color e ícono a cada categoría
- 🏷️ Asignar categoría a cada tarea
- 🔍 Filtrar tareas por categoría

### Filtros y búsqueda
- Filtrar por estado: Todas / Activas / Completadas
- Filtrar por categoría
- Búsqueda por texto en tiempo real

### Firebase Remote Config (Feature Flags)
| Flag | Descripción | Por defecto |
|------|-------------|-------------|
| `showStatsDashboard` | Muestra el panel de estadísticas | `true` |
| `enablePriority` | Activa la selección de prioridad | `true` |
| `enableDueDate` | Activa el selector de fecha límite | `true` |
| `enableSubtasks` | Activa subtareas (futuro) | `false` |

---

## 🚀 Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- npm 9+
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`

### Instalar dependencias
```bash
npm install
```

### Ejecutar en el navegador (desarrollo)
```bash
ionic serve
# o
npm start
```

La app estará disponible en `http://localhost:8100`

---

## ⚡ Optimizaciones de Rendimiento

### Aplicadas en este proyecto

1. **`ChangeDetectionStrategy.OnPush`** en todos los componentes  
   → Angular solo re-renderiza cuando cambian los inputs por referencia

2. **Signals de Angular 17** (`signal`, `computed`)  
   → Reactividad granular sin Zone.js overhead; solo actualizan lo necesario

3. **`@for` con `track`** en todas las listas  
   → Reutiliza nodos DOM en lugar de recrearlos

4. **Lazy Loading de rutas** (`loadComponent`)  
   → Cada página se carga solo cuando se navega a ella

5. **`PreloadAllModules`** en el router  
   → Pre-carga módulos en segundo plano tras la carga inicial

6. **`@defer` ready** (estructura preparada)  
   → El `StatsCardComponent` puede moverse a `@defer` si las listas son muy grandes

7. **Paginación virtual preparada**  
   → El `filteredTasks` computed puede limitarse con slice para virtualización

8. **localStorage batching**  
   → Todas las escrituras pasan por `StorageService`, centralizando y previniendo escrituras redundantes

---

## 🎨 Decisiones de Diseño

- **Tema oscuro** con paleta índigo/violeta para contraste visual óptimo en móvil
- **Tipografía**: `Syne` (800 weight) para títulos + `DM Sans` para texto → identidad visual fuerte
- **Animaciones CSS** con `animation-delay` staggered para listas fluidas
- **Variables CSS** para todo el sistema de color → fácil theming

---

## 🔧 Comandos útiles

```bash
# Linting
npm run lint

# Build de producción web
npm run build

# Ver el bundle de producción
npx ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json

# Limpiar y reinstalar
rm -rf node_modules && npm install
```

---

## Preguntas técnicas

### ¿Cuáles fueron los principales desafíos?

1. **Sincronización de signals con Ionic**: Los componentes de Ionic como `IonModal` tienen su propio ciclo de vida. Fue necesario asegurar que el reset del formulario ocurriera _después_ del dismiss para evitar parpadeos.
2. **Remote Config con `minimumFetchInterval`**: En desarrollo el valor debe ser 0 para ver cambios inmediatos; en producción se usa 1 hora para respetar los límites de la API de Firebase.
3. **Tipado estricto con `ChangeDetectionStrategy.OnPush`**: Los signals resuelven esto elegantemente, pero requirió migrar toda la lógica a `computed()` en lugar de getters imperativos.

### ¿Qué técnicas de optimización aplicaste?

- OnPush en todos los componentes
- Signals con computed() para derivaciones reactivas
- Track by en todas las listas
- Lazy loading de páginas
- PreloadAllModules para navegación instantánea
- Single source of truth en servicios con signals

### ¿Cómo aseguraste la calidad del código?

- TypeScript strict mode activado
- Interfaces explícitas para todos los modelos
- Separación clara de responsabilidades (services, models, components, pages)
- Componentes standalone (sin NgModule)
- Nomenclatura consistente en español para el dominio del negocio
- Código comentado en puntos no obvios (Firebase, feature flags)

---

## 📦 Entregables

- [x] Código fuente con README
- [x] Estructura Cordova para Android e iOS
- [x] Integración Firebase + Remote Config
- [x] Feature flags implementados
- [x] Optimizaciones de rendimiento aplicadas
- [ ] APK (generar con `ionic cordova build android --prod`)
- [ ] IPA (generar desde Xcode en macOS)
