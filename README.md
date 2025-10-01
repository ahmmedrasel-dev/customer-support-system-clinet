# Customer Support System — Client

A modern, responsive client interface for a customer support / ticketing system built with Next.js (App Router) and Tailwind CSS. This repository contains the front-end (client) application with authentication, role-based access control, and separate dashboards for customers and administrators.

## Key Features

### Authentication & Authorization
- **Secure Authentication**: Login and registration with JWT tokens stored in cookies
- **Role-Based Access**: Separate dashboards for customers and administrators
- **Protected Routes**: Middleware-based route protection with automatic redirects
- **Session Management**: Persistent authentication with automatic logout

### Customer Dashboard
- **Ticket Management**: Create, view, and track support tickets
- **Ticket Status Tracking**: Monitor open, resolved, and closed tickets
- **Profile Management**: User profile and settings
- **FAQ Access**: Help documentation and frequently asked questions

### Admin Dashboard
- **Ticket Oversight**: Manage all customer support tickets
- **User Management**: View and manage customer accounts
- **Analytics**: Ticket statistics and performance metrics
- **System Administration**: Full administrative controls

### UI/UX Features
- **Dark-First Design**: Modern dark theme with responsive layout
- **Form Validation**: Client-side validation using react-hook-form with Zod schemas
- **Toast Notifications**: Real-time feedback using react-hot-toast
- **Mobile Responsive**: Optimized for all device sizes
- **Theme Support**: Light/dark mode toggle capability

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: react-hook-form + Zod validation
- **Authentication**: JWT with secure cookie storage
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Theme**: next-themes

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin dashboard routes
│   ├── customer/                 # Customer dashboard routes
│   ├── components/               # Shared components
│   │   ├── layout/              # Layout components
│   │   ├── auth/                # Authentication components
│   │   └── ui/                  # Reusable UI primitives
│   ├── lib/                     # Utility functions
│   └── globals.css              # Global styles
├── components/                   # Additional components
├── lib/                         # Utility libraries
├── middleware.ts                # Route protection middleware
└── public/                      # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer-support-system-clinet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Flow

1. **Registration**: New users can register with email and password
2. **Login**: Existing users authenticate with credentials
3. **Role Assignment**: Users are assigned either 'customer' or 'admin' roles
4. **Auto Redirect**: Authenticated users are automatically redirected to their appropriate dashboard
5. **Protected Routes**: Unauthorized access is prevented by middleware

## API Integration

The client expects the following backend API endpoints:

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout

### Tickets (Customer)
- `GET /api/tickets` - Get user's tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/:id` - Get specific ticket

### Tickets (Admin)
- `GET /api/admin/tickets` - Get all tickets
- `PUT /api/admin/tickets/:id` - Update ticket status
- `DELETE /api/admin/tickets/:id` - Delete ticket

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)

### Testing

```bash
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Supports Next.js deployments
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

### Build Configuration
```bash
npm run build
npm run start
```

## Security Features

- **Cookie-Based Authentication**: Secure token storage
- **Route Protection**: Middleware-based access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check API endpoints are running
   - Verify environment variables
   - Clear browser cookies

2. **Build Errors**
   - Run `npm install` to update dependencies
   - Check TypeScript errors with `npm run build`

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

### Development Tips

- Use the browser's developer tools for debugging
- Check the Network tab for API requests
- Use React DevTools for component inspection
- Monitor console logs for error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the FAQ section in the application
- Review the API documentation

---

**Note**: This is a front-end application that requires a compatible backend API server to function properly. Ensure your backend implements the expected API endpoints as documented above.
