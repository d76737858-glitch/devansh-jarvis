# DEVANSH JARVIS

A local-first personal AI command center. Jarvis converts natural-language requests into validated, permissioned tool actions, verifies their results, and records an audit trail.

## Quick start (Windows)

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and optionally set `LOCAL_AI_MODEL`.
3. Run `setup.bat`.
4. Start a local OpenAI-compatible runtime (optional for the safe built-in command parser).
5. Run `start.bat`.
6. Open http://127.0.0.1:8765.

The initial implementation is fully usable without a model for safe commands such as time, listing trusted folders, and creating a project folder. A local provider adapter is included for future model-backed planning; no cloud provider is enabled by default.

## Safety model

LLM/user text never becomes a shell command. Requests become a small structured action plan, validated by Zod, resolved through the tool registry, checked by the permission engine, executed by an allowlisted tool, verified, and logged. Filesystem paths are constrained to configured trusted roots. Destructive operations and code execution are blocked until explicit confirmation support is added.

## API

- `POST /api/chat` `{ "message": "Jarvis, create a project called Demo" }`
- `GET /api/status`
- `GET /api/tools`
- `GET /api/logs`
- `GET /api/tasks`

## Development

```bash
npm install
npm run dev
npm test
```

Set `JARVIS_AUTH_TOKEN` to require `Authorization: Bearer <token>` for API calls. Keep the server bound to localhost.

## Current scope

The secure core, SQLite persistence, filesystem tools, planner, local AI adapter, REST API, activity log, and Command Center UI are implemented. Additional adapters (voice, browser automation, Windows window control, documents, study, and calendar) can register tools through the same registry without changing the orchestrator.
