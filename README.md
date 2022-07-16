# D3 Workshop

# Setup for development 

## Database - Prisma + Planet Scale
npx prisma init

DATABASE_URL = 'mysql://root@127.0.0.1:3309/<DATABASE_NAME>'

Install pscale

Install mysql-client (?)

pscale connect star-app initial-setup --port 3309

npx prisma db push

## See schema with prisma studio
npx prisma studio

# Setup for workshop participants

Set username and password in .env...