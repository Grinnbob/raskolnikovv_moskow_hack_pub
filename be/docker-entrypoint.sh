cd /raskolnikovv
npm ci
npm i pm2 -g
pm2 install pm2-logrotate@latest
pm2 set pm2-logrotate:max_size 100M
pm2 start npm --name raskolnikovv -- run start:docker --restart-delay=1000
sleep 10
npm run db:migrationAndSeed:docker
