// 通知システムのモック実装
class NotificationSystem {
  constructor() {
    this.permission = 'default';
    this.scheduledNotifications = new Map();
    this.settings = this.loadSettings();
  }

  // 通知権限を要求
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      console.log('通知権限:', permission);
      return permission;
    } catch (error) {
      console.error('通知権限の要求エラー:', error);
      return 'denied';
    }
  }

  // 通知を表示（モック）
  showNotification(title, options = {}) {
    console.log('🔔 モック通知:', { title, ...options });
    
    if (this.permission === 'granted' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          icon: '/icon.png',
          badge: '/badge.png',
          tag: 'habit-reminder',
          requireInteraction: true,
          ...options
        });

        notification.onclick = () => {
          console.log('通知がクリックされました');
          window.focus();
          notification.close();
        };

        setTimeout(() => notification.close(), 10000);
      } catch (error) {
        console.error('通知の表示エラー:', error);
      }
    }
  }

  // 習慣リマインダーをスケジュール
  scheduleHabitReminder(habitId, time, frequency) {
    const scheduleId = `${habitId}_${Date.now()}`;
    
    // 既存のスケジュールをクリア
    if (this.scheduledNotifications.has(habitId)) {
      clearInterval(this.scheduledNotifications.get(habitId).intervalId);
    }

    // 次回の通知時間を計算
    const nextNotificationTime = this.calculateNextNotificationTime(time, frequency);
    
    // インターバルを設定
    const intervalMs = this.getIntervalMs(frequency);
    const intervalId = setInterval(() => {
      if (this.settings.enabled) {
        this.showNotification(
          '習慣リマインダー',
          {
            body: `習慣「${habitId}」の時間です！`,
            timestamp: Date.now()
          }
        );
      }
    }, intervalMs);

    this.scheduledNotifications.set(habitId, {
      scheduleId,
      time,
      frequency,
      intervalId,
      nextNotification: nextNotificationTime
    });

    console.log(`リマインダーをスケジュール: ${habitId}`, {
      time,
      frequency,
      next: nextNotificationTime
    });
  }

  // 次回通知時間を計算
  calculateNextNotificationTime(time, frequency) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    if (notificationTime <= now) {
      switch (frequency) {
        case 'daily':
          notificationTime.setDate(notificationTime.getDate() + 1);
          break;
        case 'weekly':
          notificationTime.setDate(notificationTime.getDate() + 7);
          break;
        case 'hourly':
          notificationTime.setHours(notificationTime.getHours() + 1);
          break;
      }
    }

    return notificationTime;
  }

  // 頻度に応じたインターバル（ミリ秒）を取得
  getIntervalMs(frequency) {
    switch (frequency) {
      case 'hourly':
        return 60 * 60 * 1000; // 1時間
      case 'daily':
        return 24 * 60 * 60 * 1000; // 1日
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 1週間
      default:
        return 24 * 60 * 60 * 1000;
    }
  }

  // 設定を保存
  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    console.log('設定を保存しました:', this.settings);
  }

  // 設定を読み込み
  loadSettings() {
    const defaultSettings = {
      enabled: true,
      defaultTime: '09:00',
      defaultFrequency: 'daily',
      habits: {}
    };

    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
      return defaultSettings;
    }
  }

  // 特定の習慣の通知設定を更新
  updateHabitNotification(habitId, settings) {
    this.settings.habits[habitId] = settings;
    this.saveSettings(this.settings);

    if (settings.enabled) {
      this.scheduleHabitReminder(habitId, settings.time, settings.frequency);
    } else {
      this.cancelHabitReminder(habitId);
    }
  }

  // 習慣リマインダーをキャンセル
  cancelHabitReminder(habitId) {
    if (this.scheduledNotifications.has(habitId)) {
      const schedule = this.scheduledNotifications.get(habitId);
      clearInterval(schedule.intervalId);
      this.scheduledNotifications.delete(habitId);
      console.log(`リマインダーをキャンセル: ${habitId}`);
    }
  }

  // 全てのスケジュールをクリア
  clearAllSchedules() {
    this.scheduledNotifications.forEach((schedule, habitId) => {
      clearInterval(schedule.intervalId);
    });
    this.scheduledNotifications.clear();
    console.log('全てのスケジュールをクリアしました');
  }
}

// グローバルインスタンスを作成
window.notificationSystem = new NotificationSystem();