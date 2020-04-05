# Gene Expression Scatter Plot Analysis Tool

这是一款基因表达散点图可视化软件，用于分析两个基因是否在表达水平上具有
相关性。

该软件不仅考虑两个基因在所有条件下是否具有相关性，也考虑两个
基因在特定条件下是否具有相关性。

输入是3个JSON文件。

- g1.json是g1在各个样本中的表达值，JSON类型。例子:

```
  {"Sample01": 2.53, "Sample02": 2.45, "Sample03": 1.88, "Sample04": 1.85, "Sample05": 1.94}
```


- g2.json是g2在各个样本中的表达值，JSON类型。例子:

```
  {"Sample01": 9.05, "Sample02": 7.20, "Sample03": 6.94, "Sample04": 6.34, "Sample05": 6.78}
```


- info.json是每个样本的信息，JSON类型。例子:

```
  {"Sample01": {"category": "Type1", "detail": "TBA"}, "Sample02": {"category": "Type1", "detail": "TBA"}, "Sample03": {"category": "Type1", "detail": "TBA"}, "Sample04": {"category": "Type1", "detail": "TBA"}, "Sample05": {"category": "Type1", "detail": "TBA"}}
```


该软件会输出一个散点图，以及在各个生物条件下的基因表达水平相关性以及p值。



## 将TAB-delimited格式的文件或者CSV格式的文件转化为JSON格式的输入

使用tab2json或者csv2json将你的文件迅速转为Gene Expression Scatter Plot可以接收的格式。

- tab2json.py gene1.tsv > gene1.json

- csv2json.py gene1.csv > gene1.json


(tab2json，csv2json待开发)


## 安装与使用说明

### 安装

本软件无需安装。下载这个项目到你的本地，点击gene_expression_scatter_plot/gene_scatter_plot_home.html即可开始使用。

### 使用

依次点击文件选择按钮，选择3个相应的JSON文件。最后，点击Submit按钮，生成结果。


## Current Status 

目前，我们有3个协作组共12人在改进这个基因表达相关性分析工具。

除了GitHub上的更新之外，各个小组还用看板来安排具体事务，每个成员每次集中精力把一个事务做好。

- [吴贞娴、张珣、常思琦、王智洋小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=d7ca96ebee523c133af98df7ba11237738b380a7b31a709e0a4434f041fc)

- [刘莉莉、唐叶尔、何可人、陈俊蕾小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=7fa477cafd4387e57173ab1ad68b540b087cf2aec73be6debf6c5bad371b)

- [徐梦旗、王海榕、蒋佳玲、王雪洁小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=39f14efdf98ba7b19a35993a54d68a67c655e7e7a7a09dcec19c946645db)

各个协作组在每个星期四进行每周总结(Weekly Review)，讨论研究下一步工作。


| 日期          | 主持人        | 书记员  |
| ------------- |:-------------:| -------:|
| 4.9           | 吴贞娴        | 蓝珲    |
| 4.16          | 刘莉莉        | 王智洋  |
| 4.23          | 徐梦旗        | 张珣    |
| 4.30          | 常思琦        | 唐叶尔  |
| 5.7           | 王海榕        | 常思琦  |
| 5.14          | 何可人        | 蒋佳玲  |
| 5.21          | 王智洋        | 陈俊蕾  |
| 5.28          | 王雪洁        | 徐梦旗  |


主持人，准备本次要讨论的事项，不超过3项，每项讨论不超过30分钟。书记员，记录讨论的内容。



## Bug Tracker

请在我们的[缺陷跟踪器](http://118.25.96.118/bugzilla/describecomponents.cgi?product=Gene%20Expression%20Scatter%20Plot)上报告关于软件的所有缺陷，或者提交额外功能的请求。

你需要开通账户才能提交报告。 如果你需要账号，请通过电子邮件联系蓝珲 lanhui at zjnu.edu.cn。


## Requirement Traceability Matrix

每个需求至少伴有一个测试。 我们用[RMT.py](https://github.com/spm2020spring/RequirementTraceabilityMatrix)这个Python小程序来产生Requirement Traceability Matrix。

每个协作组至少要有一个成员专门负责产生这个需求追踪矩阵。

该成员需要编辑 [srs.txt](https://github.com/lanlab-org/GeneExpressionScatterPlot-XuMengqi/blob/IMPROVE-README-Hui/gene_expression_scatter_plot/test/srs.txt) 与 [test.txt](https://github.com/lanlab-org/GeneExpressionScatterPlot-XuMengqi/blob/IMPROVE-README-Hui/gene_expression_scatter_plot/test/test.txt)。 注意: 大家协作编辑 srs.txt 与 test.txt， 而不是每个组产生自己的 srs.txt 与 test.txt。 这两个文件在 gene_expression_scatter_plot/test 目录下。 对于整个软件，我们只需要一个需求追踪矩阵。

这是一个[RTM.py软件的需求追踪矩阵例子](http://lanlab.org/course/2020s/spm/test_report.html)。这是产生这个矩阵的 [srs.txt](https://github.com/spm2020spring/RequirementTraceabilityMatrix/blob/master/srs.txt) 与 [test.txt](https://github.com/spm2020spring/RequirementTraceabilityMatrix/blob/master/test.txt)。



## 需求分析文档


- 2019年4月课堂讨论: http://lanlab.org/course/2019s/se/category-specific-scatterplot.txt

- 2020年3月软件改进计划: http://lanlab.org/course/2020s/spm/decide-areas-for-improvement-review-class02395.html

- 徐梦旗文档: https://srsh.readthedocs.io/zh/latest/

- 伍泰炜文档：https://201736900125.readthedocs.io/zh_CN/latest

- 余慧、叶红霞文档: https://omg-se-201736900117.readthedocs.io/en/latest/

- 袁世家文档: https://srs-writing.readthedocs.io/en/latest/

- 吴贞娴文档: https://system1.readthedocs.io/zh_CN/latest/


我们需要将上述的需求分析文档内容合并，做出一个优于上述任何一个文档的文档。该文档的内容可能会与**Requirement Traceability Matrix**那节中提到的srs.txt的内容有所重合。 需要避免这种内容上的重合。 如果该文档中出现 srs.txt 中的内容，只需要引用 srs.txt 即可，而非重复 srs.txt 中的内容。不让同一内容出现在两个地方，这么做的目的是为了[避免文档产生不一致性](http://lanlab.org/course/2019s/se/parnas-a-rational-design-process.html#f)。



## 原始作者

徐梦旗 学号：201732120124

Email：2663479778@qq.com





## How to Contribute

We welcome your participation in this project.

Your participation does not have to be in the form of contributing code. You could help us on ideas, suggestions, documentation, etc.

You need to be an invited member of Lan Laboratory before you can push your feature branch or bugfix branch to the central reops at https://github.com/lanlab-org

Send Hui (lanhui at zjnu.edu.cn) an email message including your GitHub account name so that he could invite you to be a member of Lan Laboratory.

As of Apri 1, 2020, there are 33 members in Lan Laboratory (https://github.com/orgs/lanlab-org/people).

You will use the feature-branching workflow (see below) when interacting with the central repo. The main point of this workflow is that you work on a branch on your local drive, push that branch to the central repo, and create a Pull Request (i.e., Pull Me Request) at GitHub for other people to review your changes. When everything is OK, then someone could merge your changes to the master branch in the central repo.

I believe that code review at the Pull Request stage is important for both improving code quality and improving team quality.

### The Feature-branching Workflow

We will use the feature-branching workflow for collaboration. The idea is that you make your own branch, work on it, and push this branch to the central repo for review.

Check the section The feature-branching workflow in the following link for more detail:

https://github.com/spm2020spring/TeamCollaborationTutorial/blob/master/team.rst


## Discussion Forum

We use IRC for asynchronous communication.

Our IRC channel is at #scatterplot@irc.freenode.org.

Check [IRC Instructions](http://lanlab.org/course/2020s/spm/irc-instruction.txt) for quick start.



## Project Checklist

- [ ] Mission statement

- [ ] FAQ  (should be grown gradually, not suddenly)

- [ ] COPYING/LICENSE

- [ ] Developer Documentation

- [ ] User Documentation

- [ ] Code well commented (1 comment per 3-9 SLOC)



## Contributor List

xumengqi1-徐梦旗-201732120124

Hollyluc-王海榕-201732120105

klitile-王雪洁-201732120106

jerilmm-蒋佳玲-201732120103

吴贞娴 201732120108

常思琦 201732120101

张珣 201732120109

王智洋 201830220719

BaekLi - 刘莉莉 - 201736900108

KerenHHH - 何可人 - 201736900106

Chenwen-922 - 陈俊蕾 -201736900103

URY88 - 唐叶尔 - 201736900111

