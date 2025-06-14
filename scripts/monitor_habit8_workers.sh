#!/bin/bash

# Monitor habit8 workers completion status
# Check every 30 seconds for 5 minutes (10 checks total)

echo "Starting habit8 worker monitoring at $(date)"
echo "================================================"

for i in {1..10}; do
    echo -e "\n[Check $i/10] Time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "------------------------------------------------"
    
    # Check for done files
    echo "Checking for completion markers:"
    for worker in 1 2 3; do
        if [ -f "./tmp/habit8_worker${worker}_done.txt" ]; then
            echo "✓ habit8_worker${worker}: COMPLETED"
            ls -la "./tmp/habit8_worker${worker}_done.txt"
        else
            echo "✗ habit8_worker${worker}: Not completed yet"
        fi
    done
    
    # Check for progress logs
    echo -e "\nChecking for progress logs:"
    for worker in 1 2 3; do
        if [ -f "./tmp/habit8_worker${worker}_progress.log" ]; then
            echo -e "\n📝 habit8_worker${worker} progress log found:"
            echo "File info: $(ls -la ./tmp/habit8_worker${worker}_progress.log)"
            echo "Last 5 lines:"
            tail -5 "./tmp/habit8_worker${worker}_progress.log" 2>/dev/null || echo "  (empty or unreadable)"
        else
            echo "📝 habit8_worker${worker}: No progress log yet"
        fi
    done
    
    # Check if all workers are done
    if [ -f "./tmp/habit8_worker1_done.txt" ] && [ -f "./tmp/habit8_worker2_done.txt" ] && [ -f "./tmp/habit8_worker3_done.txt" ]; then
        echo -e "\n🎉 All habit8 workers have completed their tasks!"
        break
    fi
    
    # Sleep for 30 seconds if not the last iteration
    if [ $i -lt 10 ]; then
        echo -e "\nWaiting 30 seconds before next check..."
        sleep 30
    fi
done

echo -e "\n================================================"
echo "Monitoring completed at $(date)"
echo "Final status summary:"
echo "------------------------------------------------"

# Final summary
all_done=true
for worker in 1 2 3; do
    if [ -f "./tmp/habit8_worker${worker}_done.txt" ]; then
        echo "✓ habit8_worker${worker}: COMPLETED"
    else
        echo "✗ habit8_worker${worker}: NOT COMPLETED"
        all_done=false
    fi
done

if [ "$all_done" = true ]; then
    echo -e "\n✅ All habit8 workers successfully completed their tasks!"
else
    echo -e "\n⚠️  Some habit8 workers did not complete within the monitoring period."
fi