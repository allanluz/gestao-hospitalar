@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   ORGANIZADOR DE CAPTURAS DE TELA
echo ========================================
echo.

set "SOURCE_DIR=%USERPROFILE%\Desktop"
set "DEST_DIR=%~dp0"

echo Procurando capturas na area de trabalho...
echo Origem: %SOURCE_DIR%
echo Destino: %DEST_DIR%
echo.

:: Contadores
set /a COUNT_MOVED=0
set /a COUNT_FOUND=0

:: Procurar por arquivos PNG na area de trabalho
for %%f in ("%SOURCE_DIR%\*.png") do (
    set /a COUNT_FOUND+=1
    set "FILENAME=%%~nxf"
    
    :: Determinar destino baseado no nome do arquivo
    call :DetermineDestination "!FILENAME!" DEST_FOLDER
    
    if defined DEST_FOLDER (
        if not exist "!DEST_FOLDER!" mkdir "!DEST_FOLDER!"
        move "%%f" "!DEST_FOLDER!\"
        echo [MOVIDO] !FILENAME! -> !DEST_FOLDER!
        set /a COUNT_MOVED+=1
    ) else (
        echo [IGNORADO] !FILENAME! - nao corresponde aos padroes
    )
)

echo.
echo ========================================
echo   RELATORIO FINAL
echo ========================================
echo Arquivos encontrados: %COUNT_FOUND%
echo Arquivos organizados: %COUNT_MOVED%
echo.

if %COUNT_MOVED% gtr 0 (
    echo ✓ Capturas organizadas com sucesso!
) else (
    echo ⚠ Nenhuma captura foi organizada.
    echo   Verifique se os nomes dos arquivos seguem o padrao.
)

echo.
pause
goto :eof

:DetermineDestination
set "FILE_NAME=%~1"
set "RESULT_VAR=%~2"

:: Limpar variavel de resultado
set "%RESULT_VAR%="

:: Dashboard
if "!FILE_NAME:dashboard=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%01-dashboard"
    goto :eof
)

:: Pacientes
if "!FILE_NAME:pacientes=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%02-pacientes"
    goto :eof
)

:: Funcionarios
if "!FILE_NAME:funcionarios=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%03-funcionarios"
    goto :eof
)

:: Estoque
if "!FILE_NAME:estoque=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%04-estoque"
    goto :eof
)

:: UTI
if "!FILE_NAME:uti=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%05-uti"
    goto :eof
)

:: Centro Cirurgico
if "!FILE_NAME:cc-=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%06-centro-cirurgico"
    goto :eof
)

:: Recepcao
if "!FILE_NAME:recepcao=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%07-recepcao-centro-cirurgico"
    goto :eof
)

:: Assistencia
if "!FILE_NAME:assistencia=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%08-assistencia-intra-operatoria"
    goto :eof
)

:: Recuperacao
if "!FILE_NAME:recuperacao=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%09-recuperacao-anestesica"
    goto :eof
)

:: Infeccao
if "!FILE_NAME:infeccao=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%10-controle-infeccao"
    goto :eof
)

:: Custeio
if "!FILE_NAME:custeio=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%11-custeio-cirurgico"
    goto :eof
)

:: Materiais
if "!FILE_NAME:materiais=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%12-gerenciamento-materiais"
    goto :eof
)

:: Notificacoes
if "!FILE_NAME:notificacoes=!" neq "!FILE_NAME!" (
    set "%RESULT_VAR%=%DEST_DIR%13-notificacoes"
    goto :eof
)

goto :eof