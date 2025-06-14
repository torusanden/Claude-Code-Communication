#\!/bin/bash
echo "=== HabitPilot 実装進捗モニタリング ==="
echo "開始時刻: $(date)"

for i in {1..10}; do
    echo ""
    echo "--- チェック $i/10 ($(date +%H:%M:%S)) ---"
    
    # MVP開発チーム
    echo "【MVP開発チーム】"
    for n in 1 2 3; do
        if [ -f ./tmp/habit8_worker${n}_done.txt ]; then
            echo "Worker$n: ✅ 完了"
        elif [ -f ./tmp/habit8_worker${n}_progress.log ]; then
            echo "Worker$n: 🔄 作業中 - $(tail -1 ./tmp/habit8_worker${n}_progress.log 2>/dev/null || echo 'ログなし')"
        else
            echo "Worker$n: ⏳ 未開始"
        fi
    done
    
    # サポートチーム
    echo ""
    echo "【サポートチーム】"
    for n in 4 5 6; do
        if [ -f ./tmp/habit8_worker${n}_done.txt ]; then
            echo "Worker$n: ✅ 完了"
        elif [ -f ./tmp/habit8_worker${n}_progress.log ]; then
            echo "Worker$n: 🔄 作業中 - $(tail -1 ./tmp/habit8_worker${n}_progress.log 2>/dev/null || echo 'ログなし')"
        else
            echo "Worker$n: ⏳ 未開始"
        fi
    done
    
    # 全員完了チェック
    if [ -f ./tmp/habit8_worker1_done.txt ] && \
       [ -f ./tmp/habit8_worker2_done.txt ] && \
       [ -f ./tmp/habit8_worker3_done.txt ] && \
       [ -f ./tmp/habit8_worker4_done.txt ] && \
       [ -f ./tmp/habit8_worker5_done.txt ] && \
       [ -f ./tmp/habit8_worker6_done.txt ]; then
        echo ""
        echo "🎉 全タスク完了！"
        break
    fi
    
    sleep 30
done

echo ""
echo "=== モニタリング終了: $(date) ==="
