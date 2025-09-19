# TripGoals - Travel Website

A comprehensive travel booking website built with Next.js, featuring a customer-facing interface and admin panel for package management.

## Features

### Customer Features
- **Landing Page**: Hero section with animated slideshow, popular packages, special offers, and categories
- **Package Details**: Comprehensive package information with WhatsApp integration for booking inquiries
- **Categories**: Filterable package listings with search functionality
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Floating Contact Buttons**: WhatsApp and Instagram integration

### Admin Features
- **Dashboard**: Overview with package statistics
- **Package Management**: Full CRUD operations for travel packages
- **Category Management**: Organize packages by categories
- **Image Upload**: Integrated file storage with Appwrite
- **Authentication**: Password-protected admin access

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS
- **Backend**: Appwrite (Database, Storage, Authentication)
- **Forms**: Formik with Zod validation
- **UI**: Custom components with modern design
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
ADMIN_PASSWORD=your_admin_password
WHATSAPP_PHONE_NUMBER=+1234567890
```

### 2. Appwrite Setup

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Get your Project ID and API Key from the project settings

### 3. Database Configuration

Create the following collections in Appwrite:

#### Packages Collection (`packages`)
- `title` (String, Required)
- `subtitle` (String, Required)
- `days` (Integer, Required)
- `category` (String, Required)
- `imageId` (String, Required)
- `description` (String, Required)
- `whatsIncluded` (String Array, Required)
- `section` (String, Required) - Enum: popular, special, other
- `createdAt` (DateTime, Required)

#### Categories Collection (`categories`)
- `name` (String, Required)
- `description` (String, Required)
- `imageId` (String, Required)

### 4. Storage Configuration

Create a storage bucket named `images` for package and category images.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy

## Usage

### Customer Interface
- Browse packages on the homepage
- View detailed package information
- Contact via WhatsApp for bookings
- Filter packages by categories

### Admin Panel
- Access at `/admin` with your admin password
- Create and manage travel packages
- Upload images for packages and categories
- Organize packages into different sections (popular, special)

## Security Features

- Password-protected admin access
- Session timeout (1 hour)
- Input validation with Zod schemas
- Secure file uploads through Appwrite

## Customization

### Styling
- Modify `tailwind.config.ts` for color schemes
- Update `app/globals.css` for custom animations
- Customize components in the `/components` directory

### Business Logic
- Update contact information in environment variables
- Modify package sections and categories as needed
- Customize form validation in component files

## Support

For issues or questions, please refer to the documentation or contact the development team.