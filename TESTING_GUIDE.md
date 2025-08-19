# Testing & Quality Assurance Guide

## Unit Tests
- Model validation (see `/models/__tests__`)
- Utility functions

## Integration Tests
- API endpoints (see `/backend/__tests__`)

## End-to-End Tests (suggested tools: Cypress, Playwright)
- Register as a new user
- Login as user/admin
- Create, view, update, delete courses (admin)
- Enroll and view courses (student)
- Real-time updates (Socket.io)

## Manual Testing
- Test on Chrome, Firefox, Edge, mobile browsers
- Test on different screen sizes (responsive)
- Test error handling (invalid forms, unauthorized access)

## Accessibility
- Use semantic HTML elements
- Ensure color contrast is sufficient
- All forms have labels
- Keyboard navigation works

## Code Review & Refactoring
- Use ESLint/Prettier for code style
- Review for DRY and maintainable code
