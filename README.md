<p align="center">
  <img src="./public/assets/logo.png" width="120" height="120" alt="Logo"/>
</p>
<h1 align="center">D3 Workshop</h1>

# 📖 Table of contents

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-workshop"> ➤ About The Workshop</a></li>
    <li><a href="#about-the-app"> ➤ About The App</a></li>
    <li><a href="#setting-up"> ➤ Setting up</a></li>
    <li><a href="#getting-started"> ➤ Getting Started</a></li>
    <li><a href="#task"> ➤ Problem 1: Creating an SVG and rendering axis </a></li>
    <li><a href="#references"> ➤ References</a></li>
  </ol>
</details>

<h2 id="about-the-project"> 📝 About The Project</h2>

<p>
  About the workshop
</p>

<hr/>

<h2 id="about-the-app">💻 About The App</h2>

<p>
  About the app
  <a href="https://github.com/soketi/soketi">Soketi</a>
</p>

<hr/>

<h2 id="setting-up">🧰 Setting Up</h2>

<p>

  1. Install pscale

pscale connect star-app initial-setup --port 3309

Get .env file with all environment variabels needed to connect directly to production services (Soketi on Railway, Planetscale DB, Github Auth) and set up Next Auth.

pscale connect d3-workshop initial-setup --port 3309

2. Set DATABASE_URL environment variable
DATABASE_URL = 'mysql://root@127.0.0.1:3309/<DATABASE_NAME>'

3. Init prisma, push schema and generate client
npx prisma init
npx prisma db push

<h3>Inspecting the database with Prisma Studio</h3>
`npx prisma studio`

</p>

<hr/>

<h2 id="getting-started">🏁 Getting Started</h2>

<p>
  Getting Started
</p>

<hr/>

<h2 id="getting-started">🛠 Task 1: Creating an SVG and rendering axis</h2>

<p>
  Task 1
</p>

<hr/>

<h2 id="contributing">🏅 Contributing</h2>

<h3>Todo</h3>
<p>
   1. Make data visualization container resizable to make it possible to illustrate responsiveness
   2. Write about how the app works
   3. Write course content
   4. Figure out how to do the presentation
   5. Create problem sets based on the course content
   6. Dockerize everything to make setup for course participants easier (and more reliable, considering I might have to support windows and mac). This is not that important considering we all just connect to prod services.
</p>

<hr/>

<h2 id="references">🔗 References</h2>

<p>
  <a href="https://github.com/soketi/soketi">Soketi</a>
  https://github.com/d3/d3/wiki/#insert

  <https://github.com/d3/d3-scale-chromatic>

  <https://www.d3indepth.com/datajoins/>

  <https://github.com/pbeshai/d3-interpolate-path>
</p>

<hr/>
