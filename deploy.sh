echo "Deploying to the server..."
scp -P 2221 -r backend/* fatiya@45.80.181.4:/home/fatiya/QFlora/

echo "Done!!"