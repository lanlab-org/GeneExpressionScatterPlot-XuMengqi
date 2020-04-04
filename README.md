# Gene Expression Scatter Plot Analysis Tool

这是一款基因表达散点图可视化软件，用于分析两个基因是否在表达水平上具有
相关性。

该软件不仅考虑两个基因在所有条件下是否具有相关性，也考虑两个
基因在特定条件下是否具有相关性。

输入是3个JSON文件。

- g1.json是g1在各个样本中的表达值，JSON类型。例子:

```
  {"Sample000001": 2.5360273971241973, "Sample000002": 2.4561698890956305, "Sample000003": 1.8896865931855804, "Sample000004": 1.8591954063715899, "Sample000005": 1.9402423231503152}
```

- g2.json是g2在各个样本中的表达值，JSON类型。例子:

```
  {"Sample000001": 9.055254158570836, "Sample000002": 7.203912689242869, "Sample000003": 6.943096252000117, "Sample000004": 6.349482336960998, "Sample000005": 6.781733381310735}
```

- info.json是每个样本的信息，JSON类型。例子:

```
  {"Sample000001": {"category": "Type1", "detail": "TBA"}, "Sample000002": {"category": "Type1", "detail": "TBA"}, "Sample000003": {"category": "Type1", "detail": "TBA"}, "Sample000004": {"category": "Type1", "detail": "TBA"}, "Sample000005": {"category": "Type1", "detail": "TBA"}}
```

该软件会输出一个散点图，以及在各个生物条件下的基因表达水平相关性以及p值。



## 将TAB-delimited格式的文件或者CSV格式的文件转化为JSON格式的输入

使用tab2json或者csv2json将你的文件迅速转为Gene Expression Scatter Plot可以接收的格式。

- tab2json.py gene1.tsv > gene1.json

- csv2json.py gene1.csv > gene1.json


(tab2json，csv2json待开发)


## 安装说明

本软件无需安装。下载这个项目到你的本地，点击gene_expression_scatter_plot/gene_scatter_plot_home.html即可开始使用。


## Current Status 

目前，我们有3个协作组共12人在改进这个基因表达相关性分析工具。

除了GitHub上的更新之外，各个小组还用看板来安排具体事务，每个成员每次集中精力把一个事务做好。

- [吴贞娴、张珣、常思琦、王智洋小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=d7ca96ebee523c133af98df7ba11237738b380a7b31a709e0a4434f041fc)

- [刘莉莉、唐叶尔、何可人、陈俊蕾小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=7fa477cafd4387e57173ab1ad68b540b087cf2aec73be6debf6c5bad371b)

- [徐梦旗、王海榕、蒋佳玲、王雪洁小组](http://118.25.96.118/kanboard/?controller=BoardViewController&action=readonly&token=39f14efdf98ba7b19a35993a54d68a67c655e7e7a7a09dcec19c946645db)


## Bug Tracker

请在我们的[缺陷跟踪器](http://118.25.96.118/bugzilla/describecomponents.cgi?product=Gene%20Expression%20Scatter%20Plot)
上报告关于软件的所有缺陷，或者提交额外功能的请求。

你需要开通账户才能提交报告。 如果你需要账号，请通过电子邮件联系蓝珲 lanhui at zjnu.edu.cn。



## 需求分析文档


- 2019年4月课堂讨论: http://lanlab.org/course/2019s/se/category-specific-scatterplot.txt

- 2020年3月软件改进计划: http://lanlab.org/course/2020s/spm/decide-areas-for-improvement-review-class02395.html

- 徐梦旗文档: https://srsh.readthedocs.io/zh/latest/

- 伍泰炜文档：https://201736900125.readthedocs.io/zh_CN/latest

- 余慧、叶红霞文档: https://omg-se-201736900117.readthedocs.io/en/latest/

- 袁世家文档: https://srs-writing.readthedocs.io/en/latest/

- 吴贞娴文档: https://system1.readthedocs.io/zh_CN/latest/



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


## Project Checklist

- [ ] Mission statement

- [ ] Requirement Traceability Matrix

- [ ] FAQ  (should be grown gradually, not suddenly)

- [ ] COPYING/LICENSE

- [ ] Discussion Forum

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

