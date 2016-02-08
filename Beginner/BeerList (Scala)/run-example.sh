#!/bin/sh
cd "`dirname "$0"`"

# -XX:MaxPermSize JVM option is not required if you are running on JVM 8+

exec java \
  -XX:MaxPermSize=128m \
  -Xmx640m \
  -jar project/sbt-launch-0.13.9.jar \
  run
