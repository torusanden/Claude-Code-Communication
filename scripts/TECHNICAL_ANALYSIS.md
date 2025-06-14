# Multi-Agent Communication System Technical Analysis

## System Overview

This is a sophisticated multi-agent communication system that simulates a hierarchical organization structure where multiple AI agents (Claude instances) collaborate to complete complex development tasks. The system uses tmux sessions to coordinate communication between agents.

## Architecture

### Agent Hierarchy
1. **PRESIDENT** (separate tmux session: `president_habit8`)
   - Strategic oversight and vision setting
   - Deep needs analysis using 5-layer framework
   - Evaluates team outputs and requests improvements

2. **BOSS** (multiagent session pane 0.0: `habit8_boss1`)
   - Team coordination and creative facilitation
   - Distributes tasks to workers
   - Performs "genius-level" integration of worker outputs
   - Reports consolidated results to president

3. **WORKERS** (multiagent session panes 0.1-0.6: `habit8_worker1-6`)
   - Execute specialized tasks
   - Create structured task lists
   - Report completion via marker files
   - Log progress in dedicated files

### Communication Flow
```
PRESIDENT → boss1 → workers → boss1 → PRESIDENT
```

## Technical Implementation

### 1. Session Setup (`setup_habit8.sh`)
- Creates two tmux sessions: `multiagent_habit8` and `president_habit8`
- Configures 7 panes in multiagent session (1 boss + 6 workers)
- Auto-launches Claude in each pane with appropriate permissions
- Sends `/init` command to all agents after startup
- Sets custom PS1 prompts with color coding for each role

### 2. Message Routing (`agent-send-habit8.sh`)
Key features:
- Maps agent names to tmux pane targets
- Sends Ctrl-C before message to clear any existing input
- Logs all messages with timestamps to `logs/send_log_habit8.txt`
- Supports listing available agents with `--list` flag

Agent-to-pane mapping:
```bash
habit8_boss1 → multiagent_habit8:0.0
habit8_worker1 → multiagent_habit8:0.1
habit8_worker2 → multiagent_habit8:0.2
habit8_worker3 → multiagent_habit8:0.3
habit8_worker4 → multiagent_habit8:0.4
habit8_worker5 → multiagent_habit8:0.5
habit8_worker6 → multiagent_habit8:0.6
habit8_president → president_habit8:0
```

### 3. Progress Tracking

#### Completion Markers
Workers signal task completion by creating marker files:
```bash
touch ./tmp/habit8_worker${WORKER_NUM}_done.txt
```

#### Progress Logs
Workers log their progress with timestamps:
```bash
echo "[$(date)] タスク: $TASK_NAME - 状態: $STATUS - 進捗: $PROGRESS%" >> ./tmp/worker${WORKER_NUM}_progress.log
```

### 4. Monitoring (`monitor_habit8_workers.sh`)
- Checks worker completion status every 30 seconds
- Monitors both completion markers and progress logs
- Runs for up to 5 minutes (10 checks)
- Provides final summary of all worker statuses

## Message Format & Protocol

### Standard Message Format
Messages typically start with role identification:
```
あなたは[role]です。
[specific instructions]
```

### Task Assignment Structure
1. Project name and vision
2. Creative challenge description
3. Specific focus areas
4. Expected deliverable format
5. Completion instructions

### Completion Protocol
Workers must:
1. Create task list
2. Execute tasks systematically
3. Log progress
4. Create completion marker
5. Send structured report to boss

## Key Design Patterns

### 1. Role-Based Context Setting
Each message begins with "あなたは[role]です" to establish agent context, ensuring proper role assumption.

### 2. Structured Task Management
Workers follow a consistent pattern:
- Analyze requirements
- Create task list (やることリスト)
- Execute systematically
- Report with structure

### 3. Progress Monitoring
Boss checks progress every 10 minutes (sleep 600) and provides support as needed.

### 4. Creative Output Expectations
Boss expects 3+ innovative ideas from each worker, focusing on revolutionary approaches rather than incremental improvements.

### 5. Continuous Improvement Loop
President continues requesting improvements until user needs are 100% satisfied.

## File Structure

```
scripts/
├── agent-send-habit8.sh       # Message routing script
├── setup_habit8.sh           # Main setup script (7 panes)
├── setup_habit8_split.sh     # Alternative setup (2 windows)
├── monitor_habit8_workers.sh # Progress monitoring
├── logs/
│   └── send_log_habit8.txt  # Communication log
└── tmp/
    ├── worker*_done.txt      # Completion markers
    └── worker*_progress.log  # Progress logs
```

## Implementation Notes for Future Claude Instances

### 1. Starting a Session
```bash
./setup_habit8.sh  # Creates and initializes all agents
```

### 2. Sending Messages
```bash
./agent-send-habit8.sh [agent_name] "[message]"
```

### 3. Monitoring Progress
```bash
# Check logs
cat logs/send_log_habit8.txt

# Check completion status
ls ./tmp/*_done.txt

# Monitor in real-time
./monitor_habit8_workers.sh
```

### 4. Viewing Sessions
```bash
tmux attach -t multiagent_habit8    # View boss and workers
tmux attach -t president_habit8     # View president
```

### 5. Reset Everything
```bash
tmux kill-server
rm -rf ./tmp/*
```

## Critical Success Factors

1. **Clear Role Definition**: Each agent must understand its specific role and responsibilities
2. **Structured Communication**: Messages follow consistent format with clear instructions
3. **Progress Visibility**: Regular monitoring and status updates keep project on track
4. **Creative Freedom**: Workers are encouraged to propose innovative solutions
5. **Integration Excellence**: Boss must synthesize ideas creatively, not just aggregate

## Common Patterns in Logs

From analyzing `send_log_habit8.txt`, typical patterns include:
1. Initial vision communication from president to boss
2. Boss distributing creative challenges to workers
3. Progress check-ins at regular intervals
4. Worker completion reports with structured results
5. Boss consolidating and reporting to president
6. President requesting additional improvements

This system effectively simulates a real development team's dynamics while leveraging AI agents for parallel task execution and creative problem-solving.