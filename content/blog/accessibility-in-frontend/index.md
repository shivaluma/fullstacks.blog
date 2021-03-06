---
title: Accessibility trong frontend
date: "2022-03-06"
description: Khái quát về accessibility trong frontend.
tags: ["frontend", "html"]
---

## Accessibility (A11y)

Một trang web đạt chuẩn accessibility khi nó được thiết kế và phát triển để giúp cho mọi người đều có thể sử dụng được, kể cả những người già, những người khuyết tật hay đơn giản là những người không sử dụng các thiết bị input thông thường trên máy tính.

Sử dụng được ở đây có nghĩa là:

- Có thể tiếp nhận được nội dung trên trang web (ví dụ người khiếm thị vẫn có thể nghe được nội dung văn bản, hình ảnh, hoặc người khiếm thính vẫn có thể đọc được các nội dung âm thanh,...)
- Có thể navigate được, và tương tác được với nội dung trên trang web (người không dùng chuột thì vẫn có thể navigate bằng bàn phím, người khiếm thị vẫn có thể navigate hoặc nhập liệu được bằng giọng nói... ví dụ thế)
- Tất nhiên accessibility vẫn có thể đem lại rất nhiều lợi ích cho những người không mang khuyết tật, ví dụ keyboard navigation, hoặc người nào thị lực kém, vẫn chỉnh được chữ to lên, high constrast hơn, ai xài kết nối internet kém vẫn có thể sử dụng được trang web mà không gặp trở ngại.

Nếu chỉ có ý định support accessibility một cách cơ bản, bạn có thể focus vào các yếu tố sau:

- Đừng thay đổi thuộc tính tabIndex của một element nếu không cần thiết
- Đừng disable cái focus outline của một element (repeat after me: outline: none trong CSS là một tội ác)
- Nếu phải disable focus outline vì nó quá xấu, thì phải design một cái outline mới đẹp hơn và rõ ràng hơn để bỏ vào
- Sử dụng semantics HTML tags như &lt;article&gt;, &lt;main&gt;, &lt;nav&gt;,... nếu có thể
- Với các input element, nên đặt thuộc tính role một cách rõ ràng và chính xác
- Sử dụng element đúng với mục đích của nó, ví dụ, không dùng thẻ &lt;div&gt; để làm nút bấm (button)
- Sử dụng các thuộc tính aria-* như aria-label, aria-labelledby, aria-descibedby,... để chú thích và chỉ ra mối quan hệ cho các nội dung/element trên trang web

Hiện tại, các hệ điều hành và các trình duyệt đữa đưa ra rất nhiều tiện ích để hỗ trợ accessibility, như là screen readers (đọc nội dung của trang web dựa vào các thuộc tính aria-*, trên MacOS có VoiceOver, trên Windows phải sử dụng các ứng dụng của bên thứ 3 như JAWS), hay các giải pháp điều khiển máy tính thông qua mắt nhìn (built-in của MacOS),... tất cả những giải pháp này đều phụ thuộc rất nhiều vào tiêu chuẩn WCAG.

### Có thể tham khảo thêm các tài liệu sau đây về accessibility:

- Một vài bước kiểm tra accessibility đơn giản (https://www.w3.org/WAI/test-evaluate/preliminary/)
- Tiêu chuẩn Web Content Accessibility Guidelines (WCAG) https://www.w3.org/WAI/WCAG21/quickref/

Bên cạnh đối tượng user là những người bình thường, lành lặn, đầy đủ cả tay chân tai mắt mũi mà chúng ta vẫn tưởng tượng ra hằng ngày, ngoài kia vẫn còn rất nhiều người kém may mắn hơn, và họ vẫn có điều kiện để tiêp xúc với công nghệ mỗi ngày, và những user như họ cần được hỗ trợ nhiều hơn từ phía những người trực tiếp làm ra sản phẩm, là frontend developer chúng ta, cho nên, hãy bỏ chút thời gian và công sức để giúp đỡ những user đặc biệt này, mình chắc chắn là bạn sẽ thấy công việc của mình có nhiều ý nghĩa hơn.

Đặc biệt, đối với những frontend developer đang làm việc tại Mỹ, thì luật pháp quy định mọi trang web đều phải accessible, nên không support hoặc không quan tâm đến a11y có thể coi là phạm pháp.