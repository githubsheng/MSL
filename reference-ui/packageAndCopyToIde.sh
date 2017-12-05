#!/usr/bin/env bash

npm run build
rm ../ide/public/javascripts/reference_ui/*
rm ../ide/public/css/reference_ui/*

cp -r ./build/static/js/* ../ide/public/javascripts/reference_ui/
cp -r ./build/static/css/* css/reference_ui/

mv ../ide/public/javascripts/reference_ui/*.js ../ide/public/javascripts/reference_ui/rui.js
mv ../ide/public/css/reference_ui/*.css ../ide/public/css/reference_ui/rui.js