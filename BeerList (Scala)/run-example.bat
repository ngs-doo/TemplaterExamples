@echo off
pushd "%~dp0"

rem -XX:MaxPermSize JVM option is not required if you are running on JVM 8+
rem input.encoding is neccessary to fix jline problems in SBT shell

java ^
  -XX:MaxPermSize=256m ^
  -Dinput.encoding=Cp1252 ^
  -Xmx2g ^
  -jar project\sbt-launch-0.13.7.jar ^
  run

popd 
