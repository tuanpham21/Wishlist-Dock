# Contributing Guide

This guide will help you get started contributing to the Wishlist Dock Widget. We welcome all contributions, from bug fixes to new features!

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Convention](#commit-convention)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- Git
- Basic knowledge of React and TypeScript

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/Wishlist-Dock.git
   cd Wishlist-Dock
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/tuanpham21/Wishlist-Dock.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Start Development Server

```bash
# Start dev server with hot reload
pnpm dev

# The app will be available at http://localhost:3000
```

### 3. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### 4. Build for Production

```bash
# Build the application
pnpm build

# Build library version
pnpm build:lib

# Preview production build
pnpm preview
```

### VS Code Setup

Install these recommended extensions:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## Code Standards

### TypeScript

- Use strict TypeScript mode
- Define types for all props and state
- Avoid `any` type
- Use interfaces for object shapes

```typescript
// Good
interface CardProps {
  card: Card;
  onEdit: () => void;
  variant: 'grid' | 'list';
}

const Card: React.FC<CardProps> = ({ card, onEdit, variant }) => {
  // ...
};

// Avoid
const Card = ({ card, onEdit, variant }) => {
  // Missing types
};
```

### Component Structure

Follow this structure for components:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export const ComponentName: React.FC<Props> = ({
  prop1,
  prop2,
}: Props) => {
  // 4. Hooks
  const [state, setState] = useState();
  useEffect(() => {
    // ...
  }, []);

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Derived values
  const derivedValue = useMemo(() => {
    // ...
  }, [dependency]);

  // 7. Render
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `CardItem`, `StackView`)
- **Files**: PascalCase for components (e.g., `CardItem.tsx`)
- **Variables/Functions**: camelCase (e.g., `handleClick`, `cardList`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_CARD_COUNT`)
- **Types/Interfaces**: PascalCase (e.g., `CardProps`, `ApiResponse`)

### Import Order

1. External libraries (React, etc.)
2. Internal utilities
3. Store/hooks
4. Components (from ui folder first)
5. Types

```typescript
// 1. External
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Utils
import { generateId } from '../../utils';

// 3. Store/Hooks
import { useWishlistStore } from '../../store/wishlistStore';
import { useStackCards } from '../../hooks/useStackCards';

// 4. Components
import { Button } from '../ui/Button';
import { CardItem } from './CardItem';

// 5. Types
import type { Card } from '../../types';
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use responsive prefixes
- Group related classes

```tsx
// Good
<div className="relative rounded-lg bg-white p-4 shadow-lg transition-shadow hover:shadow-xl">
  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
</div>

// Avoid inline styles
<div style={{ padding: '1rem', backgroundColor: 'white' }}>
  {/* ... */}
</div>
```

## Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, clear storage, etc.
  });

  // Tests
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const onAction = vi.fn();
    render(<ComponentName onAction={onAction} />);

    await fireEvent.click(screen.getByRole('button'));

    expect(onAction).toHaveBeenCalledWith('expected-value');
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities and hooks
- **Component Tests**: All user flows tested
- **Store Tests**: All actions and state changes tested

### What to Test

```typescript
// DO test:
- User interactions (clicks, form submissions)
- State changes
- Error states
- Accessibility features
- Component renders with props

// DON'T test:
- React implementation details
- Third-party library behavior
- CSS classes
- Static content
```

## Pull Request Process

### 1. Create a Feature Branch

```bash
# From main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 2. Make Changes

- Follow the code standards
- Add tests for new functionality
- Update documentation if needed
- Ensure all tests pass

### 3. Commit Changes

Follow the commit convention (see below):
```bash
git add .
git commit -m "feat: add new feature description"
```

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### PR Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
```

### 5. Address Feedback

- Respond to all comments
- Make requested changes
- Keep discussion constructive
- Update PR description if needed

### 6. Merge

Once approved:
1. Rebase if needed:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Push changes:
   ```bash
   git push origin feature/your-feature-name --force-with-lease
   ```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
feat(dock): add keyboard shortcut support

Add Cmd/Ctrl+K shortcut to toggle dock visibility.
Implements accessibility requirements for keyboard navigation.

Closes #123

fix(stack): prevent duplicate stack creation

Add validation to check if stack name already exists
before creating new stack.

Closes #45

docs(readme): update installation instructions

Clarify pnpm usage and add alternative npm commands.

test(card): add swipe gesture tests

Cover card swipe animations and gesture detection
in test suite.
```

## Reporting Issues

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 108]
- Version: [e.g. v1.2.3]

**Additional Context**
Screenshots, logs, or other helpful information.
```

### Security Issues

For security vulnerabilities, email directly to:
- security@yourdomain.com
- Or create a private issue

## Feature Requests

### Before Requesting

1. Check existing issues and PRs
2. Check if feature aligns with project goals
3. Consider implementation complexity

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How you envision the feature working.

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Mockups, examples, or references.
```

## Community Guidelines

### Code of Conduct

1. **Be Respectful**
   - Treat others with respect
   - Welcome newcomers
   - Assume good intentions

2. **Be Constructive**
   - Provide helpful feedback
   - Focus on what's best for the community
   - Show empathy

3. **Be Inclusive**
   - Use inclusive language
   - Respect different viewpoints
   - Help others participate

### Getting Help

1. **Documentation**: Check docs/ folder first
2. **Issues**: Search existing issues
3. **Discussions**: Start a new discussion
4. **Discord/Slack**: Join community chat (if available)

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Special thanks in announcements

## Development Tips

### Useful VS Code Snippets

```json
{
  "React Component": {
    "prefix": "rc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:// props}",
      "}",
      "",
      "export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({",
      "  ${3}",
      "}: ${1:ComponentName}Props) => {",
      "  return (",
      "    <div>${4}</div>",
      "  );",
      "};"
    ]
  }
}
```

### Git Aliases

```bash
# Add to ~/.gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = !gitk
```

### Debugging Tips

```typescript
// Debug store state
console.log(useWishlistStore.getState());

// Debug re-renders
const Card = React.memo(({ card }) => {
  console.log('Card rendered:', card.id);
  return <div>{card.name}</div>;
});

// Debug props
interface Props {
  data: ComplexType;
}
const Component = ({ data }: Props) => {
  console.log('Data prop:', JSON.stringify(data, null, 2));
  // ...
};
```

---

Thank you for contributing to the Wishlist Dock Widget! 🎉

If you have any questions or need help getting started, don't hesitate to ask in the issues or discussions.