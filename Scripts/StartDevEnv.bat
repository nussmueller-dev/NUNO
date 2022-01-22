start /B GitExtensions.exe browse ../

cd ../BE/
start NUNO-Backend.sln

cd ../FE/
start /B code -a .
call ng serve --open

pause