@echo off
setlocal
if not exist .env copy .env.example .env
call npm install
if not exist data\database mkdir data\database
if not exist workspace mkdir workspace
echo DEVANSH JARVIS setup complete.
