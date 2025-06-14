#!/bin/bash

# habit8 プロジェクト専用メッセージ送信スクリプト

AGENT="$1"
MESSAGE="$2"

# セッション識別
SESSION_MULTI="multiagent_habit8"
SESSION_PRESIDENT="president_habit8"

# エージェント → tmux pane マッピング
get_target() {
  case "$1" in
    habit8_boss1) echo "$SESSION_MULTI:0.0" ;;
    habit8_worker1) echo "$SESSION_MULTI:0.1" ;;
    habit8_worker2) echo "$SESSION_MULTI:0.2" ;;
    habit8_worker3) echo "$SESSION_MULTI:0.3" ;;
    habit8_worker4) echo "$SESSION_MULTI:0.4" ;;
    habit8_worker5) echo "$SESSION_MULTI:0.5" ;;
    habit8_worker6) echo "$SESSION_MULTI:0.6" ;;
    habit8_president) echo "$SESSION_PRESIDENT:0" ;;
    *) echo "" ;;
  esac
}

# エージェント一覧表示
if [[ "$1" == "--list" ]]; then
  echo "📋 利用可能なエージェント (habit8):"
  echo "  habit8_president"
  echo "  habit8_boss1"
  echo "  habit8_worker1 ～ habit8_worker6"
  exit 0
fi

# 引数チェック
if [[ -z "$AGENT" || -z "$MESSAGE" ]]; then
  echo "使い方: ./agent-send-habit8.sh [エージェント名] [メッセージ]"
  echo "例: ./agent-send-habit8.sh habit8_worker1 \"/init\""
  exit 1
fi

# ターゲット取得
TARGET=$(get_target "$AGENT")
if [[ -z "$TARGET" ]]; then
  echo "❌ 不明なエージェント名: $AGENT"
  echo "  ./agent-send-habit8.sh --list で確認してください"
  exit 1
fi

# メッセージ送信
echo "📤 送信中: $TARGET ← \"$MESSAGE\""
tmux send-keys -t "$TARGET" C-c
sleep 0.2
tmux send-keys -t "$TARGET" "$MESSAGE" C-m
sleep 0.2

# ログ記録
mkdir -p logs
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] to $AGENT: $MESSAGE" >> logs/send_log_habit8.txt
echo "✅ 送信完了: $AGENT に \"$MESSAGE\""
