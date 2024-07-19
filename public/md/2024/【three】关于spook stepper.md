“Spook Stepper” 方法在模拟刚体运动时，通过求解一组约束条件来确保刚体在碰撞和接触时保持稳定和物理上合理的运动。它结合了位置和速度约束，通过解一个优化问题来计算物体的更新位置和速度。以下是其工作原理和一个简单的例子：

工作原理

    1.	速度和位置约束：将速度和位置约束结合起来，以确保在每个时间步长内物体的运动既符合速度约束也符合位置约束。
    2.	优化问题：通过求解一个带约束的优化问题来更新物体的位置和速度。这个优化问题可以表示为一个二次规划问题，目标是最小化速度和位置偏差，同时满足约束条件。
    3.	迭代求解：采用迭代求解方法（如高斯-赛德尔迭代法）来逐步逼近最优解。

例子

假设有两个刚体 ( A ) 和 ( B )，它们在时间步长 ( \Delta t ) 内可能发生碰撞。我们需要计算它们在碰撞后的速度和位置。

1. 定义初始条件

   • 刚体 ( A ) 和 ( B ) 的初始位置分别为 ( \mathbf{p}\_A ) 和 ( \mathbf{p}\_B )。
   • 它们的初始速度分别为 ( \mathbf{v}\_A ) 和 ( \mathbf{v}\_B )。
   • 设碰撞接触点为 ( \mathbf{c} )，法向量为 ( \mathbf{n} )。

2. 建立约束条件

   • 速度约束：在碰撞方向上的相对速度应满足动量守恒和能量守恒。
   • 位置约束：在时间步长 ( \Delta t ) 内，两个物体的接触点位置应保持一致。

3. 形式化优化问题

目标是最小化以下目标函数：
J = \frac{1}{2} \left( \| \mathbf{v}\_A{\prime} - \mathbf{v}\_A \|^2 + \| \mathbf{v}\_B{\prime} - \mathbf{v}\_B \|^2 + \| \mathbf{p}\_A{\prime} - \mathbf{p}\_A \|^2 + \| \mathbf{p}\_B{\prime} - \mathbf{p}\_B \|^2 \right)

其中 ( \mathbf{v}\_A’ ) 和 ( \mathbf{v}\_B’ ) 是碰撞后的速度，( \mathbf{p}\_A’ ) 和 ( \mathbf{p}\_B’ ) 是碰撞后的位置。

约束条件如下：
\mathbf{n} \cdot (\mathbf{v}\_A{\prime} - \mathbf{v}\_B{\prime}) = - e \mathbf{n} \cdot (\mathbf{v}\_A - \mathbf{v}\_B)
\mathbf{c}\_A{\prime} = \mathbf{c}\_B{\prime}

其中 ( e ) 是恢复系数，表示碰撞的弹性程度。

4. 迭代求解

使用迭代方法求解上述优化问题，逐步调整 ( \mathbf{v}\_A’ )、( \mathbf{v}\_B’ )、( \mathbf{p}\_A’ )、( \mathbf{p}\_B’ ) 直到收敛。

结果

通过 Spook Stepper 方法，我们能够得到在时间步长 ( \Delta t ) 内，刚体 ( A ) 和 B 的更新速度和位置，从而模拟它们在碰撞后的运动。这种方法通过结合速度和位置约束，使得模拟结果更加稳定和物理上合理，适用于复杂的碰撞和接触情况。

参考

    •	Müller, Matthias, and Marcus Gross. “Robust contact detection and collision response.” In Proceedings of the 7th International Conference on Computer Animation and Social Agents (CASA 2004), pp. 15-24. 2004.
