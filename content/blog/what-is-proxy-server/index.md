---
title: Proxy Server là gì ?
date: "2022-03-07"
description: Tản mạn về Proxy Server.
tags: ["network", "system design"]
---

"Proxy" có nghĩa là một cá nhân hay một công cụ nào đó đứng giữa và thay mặt cho những vật khác. 

Một proxy server là một server (có thể là một computer system hoặc application) mà nó đóng vai trò trung gian, đứng giữa client và server, tiếp nhận các requests từ client và lấy tài nguyên từ các server sau đó gửi trả về cho client.

![Proxy request](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Proxy_concept_en.svg/1920px-Proxy_concept_en.svg.png)

Nói nôm na một cách đơn giản thì việc sử dụng proxy server giống như là thay vì chúng ta tự đi mua đồ ăn thì có thể đặt grab/baemin ship đến tận cửa. Vì người thực hiện request đến nhà hàng(server), hay người trực tiếp đến mua là mấy ông shipper (proxy server) và cũng chính mấy ông shipper (proxy server) là người đưa đồ ăn cho chúng ta (client) =)).

Qua ví dụ trên ta dễ thấy thì sử dụng proxy server giúp đơn giản hoá hay kiểm soát mức độ phức tạp của yêu cầu.
Ngoài ra còn có các lợi ích bổ sung như:
-  Cân bằng tải (giả sử shop có nhiều chi nhánh, client chỉ cần đặt qua app (Proxy Server) thì shipper sẽ tự chọn quán mà mua, đúng món là được).
-  Quyền riêng tư & bảo mật (Shop sẽ không biết thằng mua hàng là thằng nào, lỡ bị ăn 1* cũng không biết kiếm ai mà chửi).
- Mở rộng cấu trúc và tính đóng gói của các hệ thống phân tán (tránh gọi trực tiếp vào các server).

Tường lửa (Firewall) không thể được xem là proxy servers bởi vì mặc dù có chức năng chặn và cho phép truy cập dựa trên các quy tắc, tường lừa không thể định tuyến (route) các requests như các loại proxy servers khác.

Proxies còn có thể cung cấp các authentication services và mặc định cung cấp ẩn danh các thông tin cho client.

## Phân loại Proxies

Proxies có thể phân loại dựa trên 2 categories:

1. Routing pattern
2. Protocol access

### Routing Pattern


#### Forward Proxies


![Forward](https://images.viblo.asia/42f35b30-ce00-4c70-9fa6-0ae5da4c420e.jpg)

Chúng là loại proxy server được dùng phía client, nó có thể được đặt ở trong mạng nội bộ hoặc trên internet. Khi sử dụng forward proxy, các requests phía client sẽ tới proxy server và proxy server sẽ chuyển tiếp các requests này tới Internet.

Tác dụng:
- Ẩn địa chỉ IP của client khi truy cập tới các website trên internet do phía các website chỉ có thể biết được địa chỉ của forward proxy server.
- Bypass firewall restriction để truy cập các website bị chặn bởi công ty, chính phủ, bla bla.
- Dùng trong công ty, tổ chức để chặn các website không mong muốn, quản lý truy cập và chặn các content độc hại.
- Sử dụng làm caching server để tăng tốc độ.


#### Reverse Proxies

![Reverse](https://images.viblo.asia/b1c64752-1007-42c6-a864-49865f023acf.jpg)

Thay vì dùng ở phía client như là Forward Proxy thì Reverse Proxy sẽ được dùng ở phía server.

Requests sẽ đi từ client tới proxy server và sau đó proxy server sẽ chuyển tiếp các requests này tới server backend. Tác dụng của Reverse Proxy bao gồm:
- Load balancing: giúp điều phối requests tới các servers backend để cân bằng tải, ngoài ra nó còn giúp hệ thống đạt tính sẵn sàng cao khi lỡ không may có server bị ngỏm thì nó sẽ chuyển request tới một server còn sống để thực thi.
- Increased Security: Reverse Proxy còn đóng vai trò là một lớp bảo vệ cho các servers backend. Nó giúp cho chúng ta có thể ẩn đi địa chỉ và cấu trúc thực của server backend.
- Logging: Tất cả các requests tới các servers backend đều phải đi qua reverse proxy nên việc quản lý log của access tới từng server và endpoint sẽ dễ dàng hơn rất nhiều so với việc kiểm tra trên từng server một.
- Encrypted Connection: Bằng việc mã hóa kết nối giữa client và reverse proxy với TLS, users sẽ được hưởng lợi từ việc mã hóa dữ liệu và bảo mật với HTTPS.


![Reverse](https://oxylabs.io/blog/images/2021/05/Forward-Reverse.png)
