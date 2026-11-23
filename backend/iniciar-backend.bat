@echo off
cd /d "%~dp0"
for %%s in (cliente catalogo pedido pago envio usuarios inventario devoluciones resenas notificaciones apigateway) do (
  echo Iniciando %%s...
  start "%%s" /D "%~dp0%%s" cmd /k mvnw.cmd spring-boot:run
  timeout /t 4 /nobreak >nul
)
echo.
echo Se abrieron 11 ventanas, una por microservicio. No las cierres mientras uses la tienda.
pause
