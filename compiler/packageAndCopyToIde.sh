#!/usr/bin/env bash

mvn package
rm ../ide/compiler/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar
cp ./target/MSL-1.0-SNAPSHOT-jar-with-dependencies.jar ../ide/compiler/