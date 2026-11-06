-- ====================================================================
-- SEED DATA FOR DEMO & TESTING
-- ====================================================================

-- Sample Admin and Demo Players (if profiles exist or for offline mock)
INSERT INTO public.announcements (title, content, banner_type, is_active)
VALUES 
    ('Welcome to Lumina WinGo!', 'Play completely free virtual points color prediction simulator. Win daily streaks and top the leaderboard!', 'event', true),
    ('Responsible Play Notice', 'This website is strictly a virtual simulation entertainment platform. Virtual points hold ZERO monetary value.', 'info', true),
    ('Daily Streak Bonus Live', 'Claim your daily free 250 virtual points every 24 hours in the Activity Center!', 'event', true);

