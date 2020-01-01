# set

Online, real-time set application hosted on Firebase.

Made by Eric Zhang and Cynthia Du. Special thanks to Vicki Xu for helpful discussions on design.

## Realtime DB Structure

The structure of the realtime database is described below.

- root (setwithfriends)
  - **games**
    - _game id_
      - history: [timestamped list of score events]
      - deck: [array of cards]
      - meta
        - admin: [user id]
        - created: [time stamp]
        - status: ['waiting' or 'ingame' or 'done']
        - users:
          - _user id_: { name, color }
  - **users**
    - _user id_
      - games: [list of game ids]
      - color: [last used color]
      - name: [last used name]

## TODO

- [x] Migrate to Material UI
- [ ] Implement basic interface/layout
- [ ] Re-integrate backend
- [ ] Modals
- [ ] Coherent card animations
- [ ] Firebase database rules
- [ ] Additional features
  - [ ] "Play again" button
  - [ ] Chat
  - [ ] Spectating
  - [ ] Statistics panel
  - [ ] Quick-play queueing
  - [ ] Options panel (setting color)
  - [ ] Keyboard shortcuts to select cards
  - [ ] Responsive layout
  - [ ] Wittier 404 page
