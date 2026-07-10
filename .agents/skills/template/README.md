# Skill Template

This directory contains a template for creating new AI agent skills following the Agent Skills specification.

## Directory Structure

```
template/
├── SKILL.md          # Main skill definition file
├── scripts/          # Optional: Helper scripts or utilities
├── references/       # Optional: Reference documentation or links
├── assets/           # Optional: Images, diagrams, or other assets
└── README.md         # This file
```

## SKILL.md Format

The SKILL.md file follows the Agent Skills specification with YAML frontmatter and Markdown content.

### Frontmatter Fields

| Field               | Type   | Required | Description                               |
| ------------------- | ------ | -------- | ----------------------------------------- |
| `name`              | string | Yes      | Unique skill identifier (kebab-case)      |
| `version`           | string | Yes      | Semantic version (e.g., 1.0.0)            |
| `description`       | string | Yes      | Clear description for discoverability     |
| `author`            | string | Yes      | Author name and email                     |
| `license`           | string | Yes      | License identifier (e.g., MIT)            |
| `repository`        | string | No       | GitHub repository URL                     |
| `tags`              | array  | No       | Relevant tags for categorization          |
| `triggers`          | array  | Yes      | Phrases that should invoke this skill     |
| `negative_triggers` | array  | No       | Phrases that should NOT invoke this skill |
| `compatibility`     | array  | Yes      | Supported AI platforms                    |

### Content Sections

After the frontmatter, include these sections:

1. **Description**: Detailed explanation of the skill
2. **Usage**: How to use the skill (basic and advanced)
3. **Configuration**: Any configuration options
4. **Examples**: Concrete usage examples
5. **Requirements**: Prerequisites or dependencies
6. **Troubleshooting**: Common issues and solutions
7. **References**: Related documentation or resources
8. **Changelog**: Version history

## Best Practices

### Description Optimization

- Focus on **what** the skill does and **when** to use it
- Keep it concise and discoverable
- Avoid technical jargon when possible
- Include negative triggers (when NOT to use)

### File Size

- Keep SKILL.md under 500 lines for progressive disclosure
- Break complex skills into multiple smaller skills if needed

### Versioning

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

### Compatibility

- Always specify supported platforms
- Test on multiple platforms when possible
- Document platform-specific behavior

## Creating a New Skill

1. Copy this template directory
2. Rename the directory to your skill name (kebab-case)
3. Edit SKILL.md with your skill's information
4. Add any necessary scripts, references, or assets
5. Test the skill on supported platforms
6. Update the skill metadata and frontmatter

## Example Skill

See the SKILL.md file in this template for a complete example.

## Resources

- [Agent Skills Specification](https://agentskills.io)
- [Skill Best Practices](https://agentskills.io/best-practices)
- [Community Skills](https://github.com/agentskills/community)
