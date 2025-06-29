# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Multi-Agent Communication System that simulates a hierarchical organization structure where multiple AI agents collaborate to complete complex development tasks. The system uses tmux sessions to coordinate communication between a President (strategic oversight), Boss (team management), and Workers (task execution).

## Key Commands

### Environment Setup
```bash
# Set up tmux sessions for habit8 project (6 workers)
./setup_habit8.sh

# Set up split-screen version (3 workers)
./setup_habit8_split.sh

# For other projects, copy and modify setup scripts
```

### Agent Communication
```bash
# Send messages between agents
./agent-send-habit8.sh [agent_name] "[message]"

# List available agents
./agent-send-habit8.sh --list

# Examples:
./agent-send-habit8.sh habit8_president "あなたはpresidentです。指示書に従って"
./agent-send-habit8.sh habit8_boss1 "プロジェクト開始"
./agent-send-habit8.sh habit8_worker1 "タスク完了"
```

### Session Management
```bash
# View multi-agent session
tmux attach-session -t multiagent_habit8

# View president session  
tmux attach-session -t president_habit8

# Start Claude in all sessions (if not auto-started)
tmux send-keys -t president_habit8 'claude' C-m
for i in {0..6}; do tmux send-keys -t multiagent_habit8:0.$i 'claude --dangerously-skip-permissions' C-m; done

# Monitor worker progress
./scripts/monitor_habit8_workers.sh

# Reset everything
tmux kill-server
rm -rf ./tmp/*
```

### Progress Monitoring
```bash
# Check communication logs
cat logs/send_log_habit8.txt

# Check worker completion status
ls ./tmp/habit8_worker*_done.txt

# View worker progress
cat ./tmp/habit8_worker*_progress.log
```

## Architecture & Communication Flow

The system implements a hierarchical communication pattern:

1. **PRESIDENT** (separate tmux session) → Receives user requirements, analyzes deep needs, provides strategic vision
2. **boss1** (multiagent:0.0) → Receives vision from President, coordinates team, assigns creative challenges  
3. **worker1-6** (multiagent:0.1-6) → Execute specialized tasks, report back to boss
4. Flow: PRESIDENT → boss1 → workers → boss1 → PRESIDENT

### Agent Roles & Instructions
- `instructions/habit8_president.md` - Strategic oversight, deep needs analysis using 5-layer framework
- `instructions/habit8_boss1.md` - Team coordination, creative facilitation, 10-minute progress checks
- `instructions/habit8_worker*.md` - Task execution with structured task lists, systematic implementation

### Coordination Mechanisms
- Message routing through `agent-send-habit8.sh` script with tmux send-keys
- Completion tracking via `./tmp/habit8_worker*_done.txt` files
- Progress logs in `./tmp/habit8_worker*_progress.log`
- Centralized logging in `logs/send_log_habit8.txt`

## Technical Implementation Details

### Tmux Pane Mapping
```bash
# setup_habit8.sh creates:
president_habit8 session (1 pane)
multiagent_habit8 session (7 panes):
  - Pane 0: boss1 (red prompt)
  - Pane 1-6: worker1-6 (blue prompts)
```

### Message Format
All messages begin with role context: `"あなたは[role]です"`
This ensures agents understand their identity and follow appropriate instructions.

### Progress Monitoring Protocol
1. Workers create completion markers: `touch ./tmp/habit8_worker${N}_done.txt`
2. Workers log progress: `echo "[$(date)] タスク: X - 状態: Y" >> ./tmp/habit8_worker${N}_progress.log`
3. Boss checks completion every 10 minutes and provides support
4. Monitor script (`monitor_habit8_workers.sh`) runs every 30 seconds for 5 minutes

## Project-Specific Context

### HabitPilot Project
When working on the habit management app project:
- Vision: "できない自分を、できる自分に変える" (Transform who you can't be into who you can be)
- Key features: Task management, time-based reminders, weekly/monthly reviews, self-evaluation
- Success metrics: 50%+ users with 7+ day streaks, <1 min task entry, 80%+ weekly review rate

### EmotiFlow Project (Example MVP)
A completed emotion-based survey system demonstrating system capabilities:
- Location: `emotiflow-mvp/` directory
- Features: Emoji-based emotion input, real-time results, mobile responsive
- Run: `cd emotiflow-mvp && python -m http.server 8000`

## Development Guidelines

1. **Message Format**: Always prefix with "あなたは[agent_name]です" to establish context
2. **Task Management**: Workers should create やることリスト (task lists), execute systematically, and report structured results
3. **Completion Protocol**: Workers must create completion markers when finished
4. **Error Handling**: If tasks fail, report to boss1 for guidance and retry with different approaches
5. **Progress Updates**: Boss1 checks progress every 10 minutes and provides support as needed
6. **Creative Output**: Boss expects 3+ innovative ideas from each worker, focusing on revolutionary approaches

## Important Implementation Notes

- Sessions naming: `multiagent_habit8` and `president_habit8`
- Pane mapping: boss1 (0.0), worker1-6 (0.1-0.6)
- All agents wait for explicit instructions starting with "あなたは[role]です"
- President continues requesting improvements until user needs are 100% satisfied
- Boss integrates ideas with "genius-level" synthesis, not just aggregation
- Communication logs include timestamps and full message content for debugging
- The monitor script checks worker status every 30 seconds for up to 5 minutes