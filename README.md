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



# Commands

npx prisma studio 
pscale connect d3-workshop initial-setup --port 3309


https://github.com/d3/d3/wiki/#insert

https://github.com/d3/d3-scale-chromatic

https://www.d3indepth.com/datajoins/

https://github.com/pbeshai/d3-interpolate-path

