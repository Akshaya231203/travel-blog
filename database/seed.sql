-- Development sample posts.
-- First create an account in the app using demo@wanderly.test, then run this file.
-- Passwords are never inserted by SQL; the app hashes them during signup.
INSERT INTO posts (user_id, title, location, description, image)
SELECT id, 'A quiet morning in the mountains', 'Manali, Himachal Pradesh',
       'We woke before sunrise and watched the valley turn gold. The best part of the trip was taking the slow road and stopping wherever the view asked us to.',
       'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85'
FROM users WHERE email = 'demo@wanderly.test'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'A quiet morning in the mountains' AND user_id = users.id);

INSERT INTO posts (user_id, title, location, description, image)
SELECT id, 'Salt air and slow afternoons', 'Varkala, Kerala',
       'A few days by the sea, fresh chai after a swim, and long walks along the cliffs. Varkala gave us exactly the reset we needed.',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
FROM users WHERE email = 'demo@wanderly.test'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Salt air and slow afternoons' AND user_id = users.id);

INSERT INTO posts (user_id, title, location, description, image)
SELECT id, 'The blue lanes of Jodhpur', 'Jodhpur, Rajasthan',
       'We spent the day wandering the old city, finding tiny cafés and watching the fort light up at sunset. Bring comfortable shoes and leave room to get lost.',
       'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85'
FROM users WHERE email = 'demo@wanderly.test'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'The blue lanes of Jodhpur' AND user_id = users.id);
