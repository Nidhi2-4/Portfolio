/**
 * ==========================================================================
 * INTERACTIVE DEVELOPER TERMINAL
 * Interactive CLI emulator with commands, autocomplete, history & modal links
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminalBody');
  const terminalInput = document.getElementById('terminalInput');
  const quickCmdButtons = document.querySelectorAll('.quick-cmd-btn');

  if (!terminalBody || !terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<div class="terminal-line accent">Available Terminal Commands:</div>
<div class="terminal-line output">• <span class="accent">about</span>          - Read Nidhi's background & philosophy</div>
<div class="terminal-line output">• <span class="accent">skills</span>         - View categorized technical proficiencies</div>
<div class="terminal-line output">• <span class="accent">projects</span>       - List all featured projects & interactive links</div>
<div class="terminal-line output">• <span class="accent">open &lt;name&gt;</span>     - Open modal details (e.g. <span class="success">open himsagar</span>, <span class="success">open kyro</span>)</div>
<div class="terminal-line output">• <span class="accent">experience</span>     - View work history & software internships</div>
<div class="terminal-line output">• <span class="accent">resume</span>         - Download or view Nidhi's latest resume PDF</div>
<div class="terminal-line output">• <span class="accent">contact</span>        - Get direct email, LinkedIn & GitHub links</div>
<div class="terminal-line output">• <span class="accent">date</span>           - Display current date and time</div>
<div class="terminal-line output">• <span class="accent">clear</span>          - Clear the terminal console</div>
    `,

    resume: () => {
      const link = document.createElement('a');
      link.href = 'assets/Resume-Nidhi-Updated.pdf';
      link.download = 'Nidhi_Dharme_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return `<div class="terminal-line success">📄 Opening / downloading <strong>Resume-Nidhi-Updated.pdf</strong>...</div>
<div class="terminal-line output">Direct link: <a href="assets/Resume-Nidhi-Updated.pdf" target="_blank" class="accent" style="text-decoration:underline;">Open Resume PDF ↗</a></div>`;
    },

    about: () => `
<div class="terminal-line success">🚀 Nidhi Dharme — Full-Stack Engineer & Technical Writer</div>
<div class="terminal-line output" style="margin-top:6px;">
  Hi! I build production web apps and write the high-impact content that gets people to them.
</div>
<div class="terminal-line output" style="margin-top:8px;">
  ⚡ <span class="accent">Current Engineering:</span> Shipping production auth, background job queues, and management platforms at <strong>BeRam Drones</strong>.
</div>
<div class="terminal-line output">
  ⚡ <span class="accent">Editorial & SEO:</span> Authored 100+ SEO articles at <strong>Cop&Drop</strong> driving +10% audience growth; Head Editor & Illustrator at <strong>ARCEON</strong>.
</div>
<div class="terminal-line output">
  ⚡ <span class="accent">National Recognitions:</span> <strong>3rd Prize Winner</strong> at MEDHA Medithon 2026 (700+ teams across India) with <em>SureStep</em> (pediatric CV health app).
</div>
<div class="terminal-line output" style="margin-top:8px;">
  💡 <span class="success">Philosophy:</span> <em>"I build things that work, and make them look good doing it. Always striving to become a better person than yesterday."</em>
</div>
    `,

    whoami: () => `
<div class="terminal-line success">guest@portfolio (Guest User with Interactive Permissions)</div>
<div class="terminal-line output">Feel free to inspect projects, run commands, or explore the portfolio!</div>
    `,

    skills: () => `
<div class="terminal-line accent">🛠️ Technical Proficiencies:</div>
<div class="terminal-line output">⚡ <span class="success">Languages:</span> JavaScript (ES6+), TypeScript, Python, Java, SQL, GLSL</div>
<div class="terminal-line output">⚡ <span class="success">Frontend & UI:</span> Next.js 16, React 19, Tailwind CSS, Framer Motion, Zustand, TanStack Query, React Flow, Leaflet.js, Recharts, HTML5 Canvas</div>
<div class="terminal-line output">⚡ <span class="success">Backend & Data:</span> Node.js, Express.js, FastAPI, PostgreSQL, Prisma ORM, Redis, Socket.IO, Server-Sent Events (SSE), Zod</div>
<div class="terminal-line output">⚡ <span class="success">AI & Creative Tech:</span> TouchDesigner, MediaPipe, Mistral AI, Agora RTC Voice AI, Deepgram ASR, MiniMax TTS, pgvector & RAG</div>
<div class="terminal-line output">⚡ <span class="success">Tools & Deploy:</span> Docker, Git/GitHub, Vercel, Render, Cloudflare Tunnels, Google OAuth, Upstash</div>
    `,

    projects: () => {
      const projs = window.portfolioProjects || [];
      if (!projs.length) {
        return `<div class="terminal-line output">Tip: Scroll to the Projects section to browse interactive cards.</div>`;
      }
      let html = `<div class="terminal-line accent">Featured Production Projects (${projs.length}):</div>`;
      projs.forEach((p, idx) => {
        html += `
<div class="terminal-line output">
  <span class="success">${idx + 1}. ${escapeHTML(p.title)}</span>
  <br>&nbsp;&nbsp;&nbsp;↳ Tags: ${p.tags.slice(0, 4).join(', ')}
  <br>&nbsp;&nbsp;&nbsp;↳ <a href="${p.demoUrl || '#'}" target="_blank" class="accent" style="text-decoration:underline;">Live Demo ↗</a> | <a href="${p.githubUrl || '#'}" target="_blank" class="accent" style="text-decoration:underline;">GitHub ⌥</a>
</div>`;
      });
      html += `<div class="terminal-line output" style="margin-top:6px;">Tip: Type <span class="accent">open himsagar</span> or <span class="accent">open kyro</span> to launch project modals directly!</div>`;
      return html;
    },

    experience: () => `
<div class="terminal-line accent">💼 Professional Work Experience:</div>
<div class="terminal-line output">1. <span class="success">Full Stack Developer Intern</span> @ <strong>BeRam Drones</strong> (Nagpur, On-site)</div>
<div class="terminal-line output">&nbsp;&nbsp;&nbsp;↳ Built auth, email delivery, and background job queues for 2 production SaaS platforms.</div>
<div class="terminal-line output">2. <span class="success">Content Writer Intern</span> @ <strong>Cop&Drop</strong> (Bangalore, Remote)</div>
<div class="terminal-line output">&nbsp;&nbsp;&nbsp;↳ Published 100+ SEO-optimized technical & culture articles with keyword analysis.</div>
    `,

    contact: () => `
<div class="terminal-line success">📬 Let's Connect & Collaborate:</div>
<div class="terminal-line output">📧 Email: <a href="mailto:nidhi24dharme2006@gmail.com" class="accent" style="text-decoration:underline;">nidhi24dharme2006@gmail.com</a></div>
<div class="terminal-line output">💼 LinkedIn: <a href="https://www.linkedin.com/in/nidhi-dharme-b65085344/" target="_blank" class="accent" style="text-decoration:underline;">linkedin.com/in/nidhi-dharme-b65085344</a></div>
<div class="terminal-line output">📸 Instagram: <a href="https://www.instagram.com/niiidhi._24?igsh=MW53c2U2ZHN6N2JjaA%3D%3D" target="_blank" class="accent" style="text-decoration:underline;">instagram.com/niiidhi._24</a></div>
<div class="terminal-line output">🐙 GitHub: <a href="https://github.com/Nidhi2-4" target="_blank" class="accent" style="text-decoration:underline;">github.com/Nidhi2-4</a></div>
    `,

    date: () => {
      const now = new Date();
      return `<div class="terminal-line output">🕒 Current Time: <span class="success">${now.toLocaleString()}</span></div>`;
    },

    easteregg: () => `
<div class="terminal-line success">🎉 You found the easter egg!</div>
<div class="terminal-line output">"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke</div>
<div class="terminal-line accent">Move your mouse across the 3D avatar canvas in the hero section to see live gaze tracking at 60 FPS! ✨</div>
    `,

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Echo user input
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">nidhi@portfolio:~$</span> ${escapeHTML(trimmed)}`;
    terminalBody.appendChild(userLine);

    const parts = trimmed.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    if (mainCmd === 'track') {
      if (['smart', 'scrub', 'orbit'].includes(arg)) {
        if (window.avatarTrackerInstance) {
          window.avatarTrackerInstance.mode = arg;
          const btn = document.querySelector(`.mode-toggle-btn[data-mode="${arg}"]`);
          if (btn) {
            document.querySelectorAll('.mode-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        }
        const resp = document.createElement('div');
        resp.className = 'terminal-line success';
        resp.innerHTML = `✓ Avatar tracking mode switched to <strong>${arg}</strong>! Look at the hero avatar above.`;
        terminalBody.appendChild(resp);
      } else {
        const resp = document.createElement('div');
        resp.className = 'terminal-line output';
        resp.innerHTML = `Usage: track &lt;smart | scrub | orbit&gt; (e.g. <span class="accent">track orbit</span>)`;
        terminalBody.appendChild(resp);
      }
    } else if (mainCmd === 'open') {
      if (!arg) {
        const resp = document.createElement('div');
        resp.className = 'terminal-line output';
        resp.innerHTML = `Usage: open &lt;project-id&gt; (e.g. <span class="accent">open himsagar</span>, <span class="accent">open kyro</span>, <span class="accent">open aerokeep</span>)`;
        terminalBody.appendChild(resp);
      } else {
        const projs = window.portfolioProjects || [];
        const match = projs.find(p => p.id.toLowerCase().includes(arg) || p.title.toLowerCase().includes(arg));
        if (match && window.openProjectModal) {
          window.openProjectModal(match);
          const resp = document.createElement('div');
          resp.className = 'terminal-line success';
          resp.innerHTML = `✓ Opening project modal for <strong>${escapeHTML(match.title)}</strong>...`;
          terminalBody.appendChild(resp);
        } else {
          const resp = document.createElement('div');
          resp.className = 'terminal-line output';
          resp.innerHTML = `Project matching "<strong>${escapeHTML(arg)}</strong>" not found. Type <span class="accent">projects</span> to view available projects.`;
          terminalBody.appendChild(resp);
        }
      }
    } else if (mainCmd === 'echo') {
      const resp = document.createElement('div');
      resp.className = 'terminal-line output';
      resp.innerHTML = escapeHTML(arg || '');
      terminalBody.appendChild(resp);
    } else if (mainCmd === 'sudo') {
      const resp = document.createElement('div');
      resp.className = 'terminal-line output';
      resp.innerHTML = `Nice try! Permission denied: You are already operating with full guest privileges. 😉`;
      terminalBody.appendChild(resp);
    } else if (commands[mainCmd]) {
      const output = commands[mainCmd]();
      if (output) {
        const resp = document.createElement('div');
        resp.innerHTML = output;
        terminalBody.appendChild(resp);
      }
    } else {
      const resp = document.createElement('div');
      resp.className = 'terminal-line output';
      resp.innerHTML = `Command not recognized: <span style="color:#ef4444">${escapeHTML(trimmed)}</span>. Type <span class="accent">help</span> to view available commands.`;
      terminalBody.appendChild(resp);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value;
      terminalInput.value = '';
      executeCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = terminalInput.value.trim().toLowerCase();
      const list = Object.keys(commands).concat(['open himsagar', 'open kyro', 'open aerokeep', 'open sevalog']);
      const match = list.find(c => c.startsWith(current));
      if (match) {
        terminalInput.value = match;
      }
    }
  });

  quickCmdButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });
});
