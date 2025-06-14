#!/bin/bash

# 🚀 habit プロジェクト用エージェントメッセージ送信スクリプト

get_agent_target() {
    case "$1" in
        "habit_president") echo "president_habit" ;;
        "habit_boss1") echo "multiagent_habit:0.0" ;;
        "habit_worker1") echo "multiagent_habit:0.1" ;;
        "habit_worker2") echo "multiagent_habit:0.2" ;;
        "habit_worker3") echo "multiagent_habit:0.3" ;;
        *) echo "" ;;
    esac
}

show_usage() {
    cat << EOF
🤖 Agent間メッセージ送信（habit プロジェクト）

使用方法:
  $0 [エージェント名] [メッセージ]
  $0 --list

利用可能エージェント:
  habit_president - プロジェクト統括責任者
  habit_boss1     - チームリーダー  
  habit_worker1   - 実行担当者A
  habit_worker2   - 実行担当者B
  habit_worker3   - 実行担当者C

使用例:
  $0 habit_president "指示書に従って"
  $0 habit_boss1 "Hello World プロジェクト開始指示"
  $0 habit_worker1 "作業完了しました"
EOF
}

show_agents() {
    echo "📋 利用可能なエージェント:"
    echo "=========================="
    echo "  habit_president → president_habit:0     (プロジェクト統括責任者)"
    echo "  habit_boss1     → multiagent_habit:0.0  (チームリーダー)"
    echo "  habit_worker1   → multiagent_habit:0.1  (実行担当者A)"
    echo "  habit_worker2   → multiagent_habit:0.2  (実行担当者B)" 
    echo "  habit_worker3   → multiagent_habit:0.3  (実行担当者C)"
}

log_send() {
    local agent="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    mkdir -p logs
    echo "[$timestamp] $agent: SENT - \"$message\"" >> logs/send_log.txt
}

send_message() {
    local target="$1"
    local message="$2"
    echo "📤 送信中: $target ← '$message'"
    tmux send-keys -t "$target" C-c
    sleep 0.3
    tmux send-keys -t "$target" "$message"
    sleep 0.1
    tmux send-keys -t "$target" C-m
    sleep 0.5
}

check_target() {
    local target="$1"
    local session_name="${target%%:*}"
    if ! tmux has-session -t "$session_name" 2>/dev/null; then
        echo "❌ セッション '$session_name' が見つかりません"
        return 1
    fi
    return 0
}

main() {
    if [[ $# -eq 0 ]]; then show_usage; exit 1; fi
    if [[ "$1" == "--list" ]]; then show_agents; exit 0; fi
    if [[ $# -lt 2 ]]; then show_usage; exit 1; fi

    local agent_name="$1"
    local message="$2"
    local target
    target=$(get_agent_target "$agent_name")

    if [[ -z "$target" ]]; then
        echo "❌ エラー: 不明なエージェント '$agent_name'"
        echo "利用可能エージェント: $0 --list"
        exit 1
    fi

    if ! check_target "$target"; then exit 1; fi
    send_message "$target" "$message"
    log_send "$agent_name" "$message"
    echo "✅ 送信完了: $agent_name に '$message'"
    return 0
}

main "$@"
