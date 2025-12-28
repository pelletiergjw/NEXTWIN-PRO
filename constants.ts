
import type { Sport } from './types';

export const SPORTS: Sport[] = [
  {
    key: 'football',
    labelKey: 'sport_football',
    icon: '⚽',
    entityNamesKey: ['entity_team1', 'entity_team2'],
    betTypes: [
      { key: 'match_result', labelKey: 'bet_match_result' },
      { key: 'double_chance', labelKey: 'bet_double_chance' },
      { key: 'both_teams_score', labelKey: 'bet_both_teams_score' },
      { key: 'total_goals', labelKey: 'bet_total_goals' },
      { key: 'scorer', labelKey: 'bet_scorer' },
      { key: 'exact_score', labelKey: 'bet_exact_score' },
      { key: 'handicap', labelKey: 'bet_handicap' },
      { key: 'half_time_full_time', labelKey: 'bet_half_time_full_time' },
      { key: 'cards', labelKey: 'bet_cards' },
      { key: 'corners', labelKey: 'bet_corners' },
    ],
  },
  {
    key: 'basketball',
    labelKey: 'sport_basketball',
    icon: '🏀',
    entityNamesKey: ['entity_team_a', 'entity_team_b'],
    betTypes: [
      { key: 'winner', labelKey: 'bet_winner' },
      { key: 'total_points', labelKey: 'bet_total_points_basket' },
      { key: 'points_per_team', labelKey: 'bet_points_per_team' },
      { key: 'over_under', labelKey: 'bet_over_under_points' },
      { key: 'handicap', labelKey: 'bet_handicap' },
      { key: 'player_points', labelKey: 'bet_player_points' },
      { key: 'rebounds_assists', labelKey: 'bet_rebounds_assists' },
      { key: 'half_time_score', labelKey: 'bet_half_time_score' },
    ],
  },
  {
    key: 'tennis',
    labelKey: 'sport_tennis',
    icon: '🎾',
    entityNamesKey: ['entity_player1', 'entity_player2'],
    betTypes: [
      { key: 'winner', labelKey: 'bet_winner' },
      { key: 'number_of_sets', labelKey: 'bet_number_of_sets' },
      { key: 'total_games', labelKey: 'bet_total_games' },
      { key: 'over_under_games', labelKey: 'bet_over_under_games' },
      { key: 'handicap_games', labelKey: 'bet_handicap_games' },
      { key: 'exact_score', labelKey: 'bet_exact_score' },
      { key: 'number_of_points', labelKey: 'bet_number_of_points' },
      { key: 'service_breaks', labelKey: 'bet_service_breaks' },
    ],
  },
];
