# USAMOS PHP 8.4 PARA IGUALAR TU ENTORNO LOCAL
FROM php:8.4-fpm

# 1. INSTALAR DEPENDENCIAS
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    nginx \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libgmp-dev \
    libicu-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip gmp intl

# 2. INSTALAR NODE.JS (Versión 20)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 3. INSTALAR COMPOSER
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. CONFIGURAR NGINX
RUN rm -f /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/nginx.conf
# Creamos carpeta para ini si no existe y copiamos
RUN mkdir -p /usr/local/etc/php/conf.d/
COPY docker/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Configurar PHP-FPM
RUN sed -i 's|listen = .*|listen = 127.0.0.1:9000|' /usr/local/etc/php-fpm.d/www.conf

# 5. WORKDIR
WORKDIR /var/www

# 6. INSTALAR DEPENDENCIAS PHP (CRÍTICO: Agregamos ignore-platform-reqs)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --ignore-platform-reqs

# 7. INSTALAR DEPENDENCIAS JS
COPY package*.json ./
RUN npm install

# 8. COPIAR APP
COPY . .

RUN php artisan filament:assets
RUN php artisan livewire:publish --assets
# 9. COMPILAR FRONTEND
RUN npm run build

# 10. PERMISOS
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# 11. ENTRYPOINT
EXPOSE 80
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]