import { GameState, IProgressRepository } from '../domain/types';

// POC implementation using local storage
export class LocalStorageRepository implements IProgressRepository {
  // Key prefix to avoid local storage collisions
  private readonly storageKeyPrefix = 'montessori_app_';

  public async getUserProgress(userId: string): Promise<GameState | null> {
    // Simulating async behavior for future API network latency
    return new Promise((resolve) => {
      const data = localStorage.getItem(`${this.storageKeyPrefix}${userId}`);
      resolve(data ? JSON.parse(data) : null);
    });
  }

  public async saveUserProgress(userId: string, state: GameState): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(`${this.storageKeyPrefix}${userId}`, JSON.stringify(state));
      resolve();
    });
  }
}
