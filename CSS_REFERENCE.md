# 🎨 Modern Design CSS Reference Guide

## Quick Color Reference

### Primary Colors
```css
/* Main Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Text */
color: #2c3e50;  /* Primary Text */
color: #555555;  /* Secondary Text */
color: #bdc3c7;  /* Light Text */

/* Backgrounds */
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
background: white;
```

### Gradient Options
```css
/* Success/Positive */
linear-gradient(135deg, #f093fb 0%, #f5576c 100%)

/* Info/Action */
linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

/* Primary */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Sidebar */
linear-gradient(180deg, #2c3e50 0%, #34495e 100%)
```

---

## Reusable CSS Classes

### Sidebar Styling
```css
.sidebar {
    height: 100vh;
    width: 260px;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
    padding-top: 30px;
    box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
}

.sidebar a {
    padding: 15px 20px;
    text-decoration: none;
    font-size: 15px;
    color: #bdc3c7;
    display: block;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
    margin: 5px 0;
}

.sidebar a:hover {
    background-color: rgba(52, 152, 219, 0.1);
    border-left-color: #3498db;
    color: #3498db;
    padding-left: 25px;
}

.sidebar a.active {
    background-color: rgba(52, 152, 219, 0.2);
    border-left-color: #3498db;
    color: #3498db;
    font-weight: 600;
}
```

### Main Content Area
```css
.main-content {
    margin-left: 260px;
    padding: 40px;
    animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Cards
```css
.data-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    border: none;
    transition: all 0.3s ease;
}

.data-card:hover {
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
}
```

### Stat/Summary Cards
```css
.card-summary {
    border-radius: 15px;
    border: none;
    color: white;
    padding: 25px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.card-summary::before {
    content: '';
    position: absolute;
    top: 0;
    right: -20px;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.card-summary:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-summary.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-summary.success {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-summary.warning {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

### Buttons
```css
.btn-action {
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-submit:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-create {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.btn-create:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(245, 87, 108, 0.3);
}
```

### Form Controls
```css
.form-control, .form-select {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 15px;
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    outline: none;
}

.form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 14px;
}
```

### Tables
```css
.table thead th {
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.05) 0%, transparent 100%);
    border: none;
    color: #2c3e50;
    font-weight: 600;
    padding: 15px;
    font-size: 14px;
}

.table tbody td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    color: #555;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}
```

### Badges
```css
.badge-paid {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-pending {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}
```

### Section Headers
```css
.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #2c3e50;
    margin-top: 30px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 3px solid #667eea;
}

.card-header {
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.05) 0%, transparent 100%);
    border-bottom: 2px solid #f0f0f0;
    border-radius: 15px 15px 0 0 !important;
    padding: 25px;
}

.card-header h5 {
    color: #2c3e50;
    font-weight: 700;
    font-size: 18px;
}
```

### Shadows
```css
/* Subtle Shadow */
box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

/* Medium Shadow */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Strong Shadow */
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

/* Sidebar Shadow */
box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);

/* Gradient Shadow */
box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
```

---

## Component Combinations

### Complete Button with Styling
```css
.btn-modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-modern:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-modern:active {
    transform: translateY(0);
}
```

### Complete Form Field
```css
.form-group {
    margin-bottom: 20px;
}

.form-group .form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-group .form-control {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 15px;
    transition: all 0.3s ease;
}

.form-group .form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
```

### Complete Card Component
```css
.modern-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    border: none;
    padding: 30px;
    transition: all 0.3s ease;
}

.modern-card:hover {
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
}

.modern-card .card-header {
    border-bottom: 3px solid #667eea;
    margin-bottom: 20px;
    padding-bottom: 15px;
}

.modern-card .card-header h4 {
    color: #2c3e50;
    font-weight: 700;
    margin: 0;
}
```

---

## Animation Presets

### Fade In
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease;
}
```

### Slide Up
```css
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-up {
    animation: slideUp 0.6s ease-out;
}
```

---

## Customization Guide

### To Change Primary Color
Replace `#667eea` and `#764ba2` throughout CSS with your brand colors.

### To Change Sidebar Width
Change `width: 260px` and `margin-left: 260px` to your preferred width.

### To Adjust Rounded Corners
- Cards: Change `border-radius: 15px`
- Buttons: Change `border-radius: 8px`
- Inputs: Change `border-radius: 8px`

### To Modify Shadows
Adjust the values in `box-shadow` properties. Format: `X Y Blur Spread Color`

### To Change Font
Update `font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;` in body selector.

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Performance Tips

1. Use CSS variables for repeated colors
2. Minimize box-shadow usage on many elements
3. Use will-change sparingly on hover effects
4. Optimize gradient usage
5. Consider prefers-reduced-motion for accessibility

---

## Accessibility Notes

- Color contrast ratio: 4.5:1 for normal text
- Focus states are clearly visible
- All interactive elements have proper hover/active states
- Icons are accompanied by text labels
- Semantic HTML structure maintained

---

**Keep this guide handy for future customizations and maintenance!** 💡
