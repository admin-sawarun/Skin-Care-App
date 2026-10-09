class PaymentModel {
  final String id;
  final int amountPaise;
  final String status; // CREATED, PAID, FAILED, REFUNDED
  final String? caseId;
  final String? caseStatus;
  final DateTime createdAt;

  const PaymentModel({
    required this.id,
    required this.amountPaise,
    required this.status,
    this.caseId,
    this.caseStatus,
    required this.createdAt,
  });

  double get amountRupees => amountPaise / 100;

  factory PaymentModel.fromJson(Map<String, dynamic> json) => PaymentModel(
        id: json['id'] as String,
        amountPaise: (json['amount'] as num).toInt(),
        status: json['status'] as String,
        caseId: (json['case'] as Map<String, dynamic>?)?['id'] as String?,
        caseStatus: (json['case'] as Map<String, dynamic>?)?['status'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String).toLocal(),
      );
}
