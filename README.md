# D3 Workshop

# Todo
0. Make data visualization container resizable to make it possible to illustrate responsiveness
1. Write about how the app works
2. Write course content
3. Figure out how to do the presentation
4. Create problem sets based on the course content
5. Dockerize everything to make setup for course participants easier (and more reliable, considering I might have to support windows and mac). This is not that important considering we all just connect to prod services.

# How the App is built

https://github.com/soketi/soketi


# Setup for development

## Database - Prisma + Planet Scale

1. Install pscale

pscale connect star-app initial-setup --port 3309

2. Set DATABASE_URL environment variable
DATABASE_URL = 'mysql://root@127.0.0.1:3309/<DATABASE_NAME>'

3. Init prisma, push schema and generate client
npx prisma init
npx prisma db push


## See schema with prisma studio
npx prisma studio

# Setup for workshop participants

Get .env file with all environment variabels needed to connect directly to production services (Soketi on Railway, Planetscale DB, Github Auth) and set up Next Auth.



pscale connect d3-workshop initial-setup --port 3309


# Useful links

https://github.com/d3/d3/wiki/#insert

https://github.com/d3/d3-scale-chromatic

https://www.d3indepth.com/datajoins/

https://github.com/pbeshai/d3-interpolate-path

