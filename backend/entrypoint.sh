#!/bin/sh
# set -e: Salir inmediatamente si un comando falla.
# set -x: Imprimir cada comando en el log antes de ejecutarlo.
set -ex

echo "--- Iniciando PHP-FPM en modo daemon ---"
php-fpm -D

echo "--- Verificando la configuración de Nginx ---"
nginx -t

echo "--- Iniciando Nginx en primer plano ---"
# Usamos comillas simples para evitar cualquier problema de interpretación
nginx -g 'daemon off;'