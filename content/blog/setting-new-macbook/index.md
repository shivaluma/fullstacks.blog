---
title: 2022 rồi, setup macOS như thế nào để code cho xịn xò
date: "2022-03-07"
description: .
tags: ["macOS", "unix"]
---

Vì Dev thường là những người lười biếng nên việc sử dụng các tool, công cụ hữu ích sẽ giúp rất nhiều cho công việc. Một khi sử dụng những công cụ không thích hợp có thể làm cho ae dev mất thêm nhiều thời gian.

Vì thế nên mình ở đây để share cho các bạn những tool mình xài mà rất hiệu quả nè =)))


## Terminal tools

### Homebrew
Debian có apt; redhat có yum, dnf; arch có pacman thì với macOS cũng không thể thiếu một package manager để install các công cụ một cách nhanh chóng được, mặc dù homebrew update và install khá lâu nhưng với repositories app và tool khổng lồ thì sẽ tiết kiệm thời gian rất nhiều vì không cần phải search các install package trên internet.

### Iterm2
Cái terminal default của macOS rất là ...basic. Không có gì đặc biệt nên việc sử dụng một công cụ khác xịn xò, với nhiều tính năng để thay thế nó thì còn gì tuyệt vời hơn. Iterm2 có khả năng break ra nhiều window session như tmux, save các window đó để sử dụng cho lần sau, và với khả năng custom giao diện mạnh mẽ cho các tín đồ của r/unixporn nữa.

![ITerm](./iterm.png)


### Fish Shell

Tại sao không phải là bash, hay ZSH mà lại là fish. Vì nó quá nhanh và tuyệt vời đó mấy bạn ơi. Support auto complete out of the box nè, syntax highlighting tuyệt vời.

#### Fisher

Để cài plugin cho fish chứ còn làm cái gì nữa.

#### Starship.rs

Dạo này mình rất dễ bị bias các tool viết bằng Rust =)). Chắc chắn sẽ học Rust trong tương lai gần.

Về Starship thì nó là một cái cross-shell promt xài được cho mọi loại shell (giống với powerlevel9k). Với khả năng show environment, git info, command runtime và khả năng customize cực mạnh bằng file config thì nó sẽ giúp ích cho bạn rất nhiều.

![Starship](./starship.webp)




