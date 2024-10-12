# p5JS_Game with Q-Learning
This is a simple JavaScript game developed using the p5.js library, which integrates Q-learning for the player’s movement decision-making. The game consists of a player-controlled object that moves left and right to collect yellow stars (rewards) while avoiding falling red bombs (penalties). The game uses the Bellman equation in its Q-learning algorithm to determine the best course of action for the player.

## Game Description
In this game:

The player can move left or right to avoid falling red bombs and collect yellow stars.
Each yellow star collected increases the score, while being hit by a red bomb ends the game.
The player's movement is controlled by a Q-learning agent that learns over time to maximize its score by collecting stars and avoiding bombs..

## Q-Learning Algorithm
Bellman Equation in Use
The Q-learning algorithm is implemented in the game to help the player "learn" the best way to move. The key concept behind Q-learning is the Bellman equation, which is used to update the Q-values based on the agent's experiences.

The Bellman equation helps us evaluate how good an action is in a particular state, considering both the immediate reward and the potential future rewards. The equation used is as follows:

𝑄
(
𝑠
,
𝑎
)
=
𝑄
(
𝑠
,
𝑎
)
+
𝛼
(
𝑟
+
𝛾
max
⁡
𝑎
𝑄
(
𝑠
′
,
𝑎
)
−
𝑄
(
𝑠
,
𝑎
)
)
Q(s,a)=Q(s,a)+α(r+γ 
a
max
​
 Q(s 
′
 ,a)−Q(s,a))
Where:

𝑄
(
𝑠
,
𝑎
)
Q(s,a) is the Q-value for taking action 
𝑎
a in state 
𝑠
s.
𝛼
α is the learning rate that controls how much of the new information overrides the old information.
𝑟
r is the reward received after taking action 
𝑎
a in state 
𝑠
s.
𝛾
γ is the discount factor, which weighs the importance of future rewards.
max
⁡
𝑎
𝑄
(
𝑠
′
,
𝑎
)
max 
a
​
 Q(s 
′
 ,a) is the maximum predicted future reward for the next state 
𝑠
′
s 
′
 .

![Bellman Equation](https://latex.codecogs.com/png.latex?Q(s,a)=Q(s,a)+\alpha\left[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\right])



