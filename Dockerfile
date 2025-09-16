# Gunakan base image PHP 8.3 dengan FPM (FastCGI Process Manager)
FROM php:8.3-fpm

# Set direktori kerja di dalam container
WORKDIR /var/www

# Install dependensi sistem yang dibutuhkan oleh Laravel & Composer
# Mengganti mysql-client dengan postgresql-client dan libpq-dev
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libpq-dev \
    postgresql-client

# Install ekstensi PHP yang umum dibutuhkan Laravel
# Mengganti pdo_mysql dengan pdo_pgsql
RUN docker-php-ext-install pdo_pgsql zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Install Composer (Manajer paket PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Salin semua file proyek ke dalam container
COPY . .

# Install dependensi PHP
RUN composer install

# Ubah kepemilikan file ke user www-data agar bisa ditulis oleh web server
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Expose port untuk FPM
EXPOSE 9000

# Jalankan PHP-FPM
CMD ["php-fpm"]