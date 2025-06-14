# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Multi-Agent Communication System that simulates a hierarchical organization structure where multiple AI agents collaborate to complete complex development tasks. The system uses tmux sessions to coordinate communication between a President (strategic oversight), Boss (team management), and Workers (task execution).

## Key Commands

### Environment Setup
```bash
# Set up tmux sessions for the habit8 project (1 boss + 6 workers)
./setup_habit8.sh

# Alternative setup with different pane layout
./setup_habit8_split.sh
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

# Monitor worker completion status (runs every 30 seconds)
./monitor_habit8_workers.sh

# Reset everything
tmux kill-server
rm -rf ./tmp/*
```

### Progress Monitoring
```bash
# Check communication logs
cat logs/send_log_habit8.txt

# Check worker completion status
ls ./tmp/*_done.txt

# View worker progress
cat ./tmp/worker*_progress.log
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
- `instructions/habit8_worker*.md` - Specialized execution (UI/UX, backend, data, testing, integration, innovation)

### Worker Specializations (habit8 project)
- **worker1**: UI/UX設計 - フロントエンドのビジュアルとインタラクション
- **worker2**: バックエンド開発 - サーバーサイドロジックとAPI
- **worker3**: データモデル設計 - 状態管理とデータ永続化
- **worker4**: テスト実装 - 品質保証と自動テスト
- **worker5**: 統合＆最適化 - システム統合とパフォーマンス
- **worker6**: 革新的機能 - AI連携と先進的な機能

### Coordination Mechanisms
- Message routing through `agent-send-habit8.sh` script with tmux send-keys
- Completion tracking via `./tmp/worker*_done.txt` files
- Progress logs in `./tmp/worker*_progress.log`
- Centralized logging in `logs/send_log_habit8.txt`
- Automated monitoring with `monitor_habit8_workers.sh`

## Development Guidelines

1. **Message Format**: Always prefix with "あなたは[agent_name]です" to establish context
2. **Task Management**: Workers create やることリスト (task lists), execute systematically, report structured results
3. **Completion Protocol**: Workers must create completion markers (`touch ./tmp/worker*_done.txt`) when finished
4. **Error Handling**: If tasks fail, report to boss1 for guidance and retry with different approaches
5. **Progress Updates**: Boss1 checks progress every 10 minutes (sleep 600) and provides support
6. **Creative Output**: Boss expects 3+ innovative ideas from each worker, focusing on revolutionary approaches

## Important Implementation Notes

- Sessions naming: `multiagent_habit8` and `president_habit8`
- Pane mapping: boss1 (0.0), worker1-6 (0.1-0.6)
- All agents should wait for explicit instructions starting with "あなたは[role]です"
- President continues requesting improvements until user needs are 100% satisfied
- Boss integrates ideas with "genius-level" synthesis, not just aggregation
- Worker progress is automatically monitored every 30 seconds by the monitoring script