# AI Agent Skills

This directory contains AI agent skills for Tabula Lens, following the Agent Skills specification for cross-platform compatibility.

## Structure

```
.skills/
├── template/         # Template for creating new skills
├── skill-name-1/     # Individual skill directories
├── skill-name-2/     # Each skill contains:
│   ├── SKILL.md      # Main skill definition
│   ├── scripts/      # Optional helper scripts
│   ├── references/   # Optional reference docs
│   └── assets/       # Optional assets
└── README.md         # This file
```

## Creating a New Skill

1. Copy the `template/` directory
2. Rename it to your skill name (kebab-case)
3. Edit `SKILL.md` with your skill's information
4. Follow the Agent Skills specification
5. Test on supported platforms

## Supported Platforms

Skills are designed to work across multiple AI platforms:

- Claude Code
- OpenAI Codex
- Gemini CLI
- VS Code Copilot
- Cursor
- JetBrains

## Specification

All skills follow the [Agent Skills specification](https://agentskills.io) for maximum compatibility.

## Best Practices

- Keep SKILL.md under 500 lines
- Optimize descriptions for discoverability
- Include negative triggers (when NOT to use)
- Use semantic versioning
- Include proper licensing
- Test on multiple platforms

## Documentation

See the `template/README.md` for detailed documentation on creating skills.
